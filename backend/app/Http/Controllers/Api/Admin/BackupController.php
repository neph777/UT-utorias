<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Respaldo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BackupController extends Controller
{
    /**
     * Obtener lista de backups
     */
    public function index()
    {
        try {
            $backups = Respaldo::orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $backups->map(function($backup) {
                    return [
                        'id' => $backup->id,
                        'nombre' => $backup->nombre,
                        'fecha' => $backup->fecha->format('Y-m-d'),
                        'hora' => $backup->fecha->format('H:i'),
                        'tamaño' => $this->getFileSize($backup->nombre),
                        'tipo' => $backup->tipo,
                        'estado' => $backup->estado,
                        'observacion' => $backup->observacion
                    ];
                })
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener backups: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error al obtener backups'], 500);
        }
    }
    
    /**
     * Generar backup manual
     */
    public function store(Request $request)
    {
        try {
            $nombre = 'backup_manual_' . date('Y_m_d_His') . '.sql';
            $ruta = storage_path('app/backups/' . $nombre);
            
            // Crear directorio si no existe
            if (!is_dir(storage_path('app/backups'))) {
                mkdir(storage_path('app/backups'), 0755, true);
            }
            
            // Generar backup de la base de datos
            $this->generarBackup($ruta);
            
            // Registrar en la base de datos
            $backup = Respaldo::create([
                'nombre' => $nombre,
                'fecha' => now(),
                'tipo' => 'manual',
                'estado' => 'completado',
                'observacion' => 'Backup manual generado por el administrador',
                'usuario_id' => auth()->id()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Backup generado exitosamente',
                'data' => [
                    'id' => $backup->id,
                    'nombre' => $nombre,
                    'fecha' => $backup->fecha->format('Y-m-d'),
                    'hora' => $backup->fecha->format('H:i'),
                    'tamaño' => $this->getFileSize($nombre),
                    'tipo' => 'manual',
                    'estado' => 'completado'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al generar backup: ' . $e->getMessage());
            
            // Registrar backup fallido
            Respaldo::create([
                'nombre' => 'backup_fallido_' . date('Y_m_d_His') . '.sql',
                'fecha' => now(),
                'tipo' => 'manual',
                'estado' => 'fallido',
                'observacion' => $e->getMessage(),
                'usuario_id' => auth()->id()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al generar backup: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Descargar backup
     */
    public function download($id)
    {
        try {
            $backup = Respaldo::findOrFail($id);
            $ruta = storage_path('app/backups/' . $backup->nombre);
            
            if (!file_exists($ruta)) {
                return response()->json(['success' => false, 'message' => 'Archivo no encontrado'], 404);
            }
            
            return response()->download($ruta, $backup->nombre, [
                'Content-Type' => 'application/sql'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al descargar backup: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error al descargar backup'], 500);
        }
    }
    
    /**
     * Eliminar backup
     */
    public function destroy($id)
    {
        try {
            $backup = Respaldo::findOrFail($id);
            $ruta = storage_path('app/backups/' . $backup->nombre);
            
            // Eliminar archivo físico
            if (file_exists($ruta)) {
                unlink($ruta);
            }
            
            // Eliminar registro
            $backup->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Backup eliminado exitosamente'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al eliminar backup: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error al eliminar backup'], 500);
        }
    }
    
    /**
     * Guardar configuración de backup automático
     */
    public function saveConfig(Request $request)
    {
        try {
            $config = [
                'frecuencia' => $request->frecuencia,
                'hora' => $request->hora,
                'retener' => $request->retener,
                'activo' => $request->activo
            ];
            
            // Guardar configuración en archivo o base de datos
            $rutaConfig = storage_path('app/backups/config.json');
            file_put_contents($rutaConfig, json_encode($config));
            
            // Programar tarea si está activo
            if ($request->activo) {
                $this->programarBackupAutomatico($config);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Configuración guardada exitosamente'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al guardar configuración: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error al guardar configuración'], 500);
        }
    }
    
    /**
     * Obtener configuración de backup
     */
    public function getConfig()
    {
        try {
            $rutaConfig = storage_path('app/backups/config.json');
            $config = [
                'frecuencia' => 'diario',
                'hora' => '02:00',
                'retener' => '30',
                'activo' => true
            ];
            
            if (file_exists($rutaConfig)) {
                $configGuardada = json_decode(file_get_contents($rutaConfig), true);
                $config = array_merge($config, $configGuardada);
            }
            
            return response()->json([
                'success' => true,
                'data' => $config
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error al obtener configuración'], 500);
        }
    }
    
    /**
     * Generar backup de la base de datos
     */
    private function generarBackup($ruta)
    {
        $database = config('database.connections.mysql.database');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $host = config('database.connections.mysql.host');
        
        // Comando mysqldump
        $comando = sprintf(
            'mysqldump --host=%s --user=%s --password=%s %s > %s',
            escapeshellarg($host),
            escapeshellarg($username),
            escapeshellarg($password),
            escapeshellarg($database),
            escapeshellarg($ruta)
        );
        
        system($comando, $resultado);
        
        if ($resultado !== 0) {
            throw new \Exception('Error al ejecutar mysqldump');
        }
        
        return true;
    }
    
    /**
     * Obtener tamaño del archivo
     */
    private function getFileSize($nombre)
    {
        $ruta = storage_path('app/backups/' . $nombre);
        
        if (!file_exists($ruta)) {
            return 'N/A';
        }
        
        $bytes = filesize($ruta);
        
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return round($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' B';
        }
    }
    
    /**
     * Programar backup automático (ejecutar con cron)
     */
    private function programarBackupAutomatico($config)
    {
        // Esto debe ser ejecutado por un cron job en el servidor
        // Se puede crear un comando de Artisan para ejecutar automáticamente
        \Log::info('Backup automático programado', $config);
    }
}