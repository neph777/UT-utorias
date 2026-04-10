import { useState } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const CambiarPassword = ({ onClose }) => {
  const { t } = useLanguage()
  const L = t.changePassword

  const [form, setForm] = useState({
    password_actual: '',
    nueva_password: '',
    nueva_password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.cambiarPassword(form);
      setSuccess(response.message || L.success);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      if (err.errors) {
        setError(Object.values(err.errors).flat().join(', '));
      } else {
        setError(err.message || L.errors.required);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">{L.title}</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {L.current}
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={form.password_actual}
              onChange={(e) => setForm({...form, password_actual: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {L.new}
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={form.nueva_password}
              onChange={(e) => setForm({...form, nueva_password: e.target.value})}
              required
              minLength={6}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {L.confirm}
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={form.nueva_password_confirmation}
              onChange={(e) => setForm({...form, nueva_password_confirmation: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="btn bg-primary-500 hover:bg-primary-600 text-white border-none flex-1"
              disabled={loading}
            >
              {loading ? L.saving : L.submit}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              {L.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarPassword;