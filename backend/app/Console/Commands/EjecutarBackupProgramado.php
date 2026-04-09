<?php

namespace App\Console\Commands;

use App\Models\BackupConfig;
use App\Models\Respaldo;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class EjecutarBackupProgramado extends Command
{
    protected $signature = 'backup:programado';
    protected $description = 'Ejecuta backup automático según configuración';

    public function handle()
    {
        try {
            $config = BackupConfig::first();
            
            if (!$config || !$config->activo) {
                $this->info('Backup automático desactivado');
                return 0;
            }
            
            // Verificar si ya se ejecutó hoy según la frecuencia
            if (!$this->debeEjecutarse($config)) {
                $this->info('No es momento de ejecutar backup');
                return 0;
            }
            
            $this->info('Ejecutando backup programado...');
            
            // Crear directorio si no existe
            $backupPath = storage_path('app/backups');
            if (!is_dir($backupPath)) {
                mkdir($backupPath, 0755, true);
            }
            
            $nombre = 'backup_' . date('Y_m_d_His') . '.sql';
            $ruta = $backupPath . '/' . $nombre;
            
            // Configuración de la base de datos
            $database = config('database.connections.mysql.database');
            $username = config('database.connections.mysql.username');
            $password = config('database.connections.mysql.password');
            $host = config('database.connections.mysql.host');
            $port = config('database.connections.mysql.port');
            
            // Comando mysqldump
            $comando = sprintf(
                'mysqldump --host=%s --port=%s --user=%s --password=%s %s > %s 2>&1',
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($database),
                escapeshellarg($ruta)
            );
            
            exec($comando, $output, $resultado);
            
            if ($resultado === 0 && file_exists($ruta) && filesize($ruta) > 0) {
                // Registrar backup exitoso
                Respaldo::create([
                    'nombre' => $nombre,
                    'fecha' => now(),
                    'tipo' => 'automatico',
                    'estado' => 'completado',
                    'observacion' => 'Backup automático programado - Frecuencia: ' . $config->frecuencia
                ]);
                
                // Actualizar última ejecución
                $config->ultima_ejecucion = now();
                $config->save();
                
                // Limpiar backups antiguos
                $this->limpiarBackupsAntiguos($config->retener_dias);
                
                $this->info('Backup completado: ' . $nombre);
                Log::info('Backup automático completado: ' . $nombre);
            } else {
                throw new \Exception('Error al ejecutar mysqldump: ' . implode("\n", $output));
            }
            
        } catch (\Exception $e) {
            Log::error('Error en backup programado: ' . $e->getMessage());
            
            Respaldo::create([
                'nombre' => 'backup_fallido_' . date('Y_m_d_His') . '.sql',
                'fecha' => now(),
                'tipo' => 'automatico',
                'estado' => 'fallido',
                'observacion' => $e->getMessage()
            ]);
            
            $this->error('Error: ' . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
    
    private function debeEjecutarse($config)
    {
        $ahora = now();
        $horaConfig = explode(':', $config->hora);
        $horaEjecucion = $ahora->copy()->setTime($horaConfig[0], $horaConfig[1]);
        
        // Si la hora de ejecución ya pasó hoy, verificar según frecuencia
        if ($ahora->lt($horaEjecucion)) {
            return false;
        }
        
        $ultimaEjecucion = $config->ultima_ejecucion;
        
        switch ($config->frecuencia) {
            case 'diario':
                return !$ultimaEjecucion || $ultimaEjecucion->lt($horaEjecucion);
                
            case 'semanal':
                return !$ultimaEjecucion || $ultimaEjecucion->lt($horaEjecucion->subWeek());
                
            case 'mensual':
                return !$ultimaEjecucion || $ultimaEjecucion->lt($horaEjecucion->subMonth());
                
            default:
                return false;
        }
    }
    
    private function limpiarBackupsAntiguos($diasRetener)
    {
        $fechaLimite = now()->subDays($diasRetener);
        
        $backupsAntiguos = Respaldo::where('created_at', '<', $fechaLimite)
            ->where('tipo', 'automatico')
            ->get();
        
        foreach ($backupsAntiguos as $backup) {
            $ruta = storage_path('app/backups/' . $backup->nombre);
            if (file_exists($ruta)) {
                unlink($ruta);
            }
            $backup->delete();
        }
        
        Log::info("Se eliminaron {$backupsAntiguos->count()} backups antiguos");
    }
}