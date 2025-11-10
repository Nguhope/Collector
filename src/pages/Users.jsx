import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Edit, UserX, UserCheck, Shield, Mail, Calendar, X, Save, Loader } from 'lucide-react';

const Users = () => {
  // const API_BASE_URL = 'http://192.168.10.96:8000';
  // const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NTg2IiwiZW1haWwiOiJjYWJyZWwubm91YmlAZWxlY2l0Lm5ldCIsInVzZXJfaWQiOiIyMGJlYTc1NC04MzFkLTQ3N2MtYmVkYi1lNGRkNTllMzdjOGQiLCJyb2xlX25hbWUiOiJhZG1pbiIsInJvbGVfaWQiOiI2NzZmNDhkMC0xMWZiLTQ5M2ItODI2Ni1iZTNhMjQ3YzQwMjYiLCJqdGkiOiIxNGQ5MzVkMC01YTMxLTRhNTMtYWE4Ni00N2NhNWQ1ZmJiYzMiLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyOTU1Nzg2fQ.brcwKuKQGBVc1ZLsFqyG1MAd_AfF6q-pwWjMnA_eC8A';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);

  
  const itemsPerPage = 10;

  // Formulaire pour ajouter un utilisateur
  const [newUser, setNewUser] = useState({
    matricule: '',
    nom: '',
    email: '',
    password: '',
    role_id: ''
  });

  // Formulaire pour modifier un utilisateur
  const [editUser, setEditUser] = useState({
    user_id: '',
    matricule: '',
    nom: '',
    email: '',
    password: ''
  });

  // Liste des rôles disponibles
  const roles = [
    { id: '676f48d0-11fb-493b-8266-be3a247c4026', name: 'ADMIN' },
    { id: '0f323d07-74cf-4a5e-ad6d-1a658a402bc8', name: 'MANAGER' }
  ];

  const Users = [
    {user_id: '1', matricule:'ELec74834', role_name:'ADMIN', email:'junior.njoya@elecit.net', statuts:'Actif', timestamp:''},
    {user_id: '2', matricule:'ELec74834', role_name:'ADMIN', email:'junior.njoya@elecit.net', statuts:'Inactif', timestamp:''},
    {user_id: '3', matricule:'ELec74834', role_name:'MANAGER', email:'junior.njoya@elecit.net', statuts:'Inactif', timestamp:''},
  ]

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/list`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Créer un nouvel utilisateur
  const handleCreateUser = async () => {
    setActionLoading('create');
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) throw new Error('Erreur lors de la création de l\'utilisateur');
      
      setSuccess('Utilisateur créé avec succès !');
      setShowAddModal(false);
      setNewUser({ matricule: '', nom: '', email: '', password: '', role_id: '' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Mettre à jour un utilisateur
  const handleUpdateUser = async () => {
    setActionLoading('update');
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(editUser)
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      setSuccess('Utilisateur mis à jour avec succès !');
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Désactiver un utilisateur
  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) return;
    
    setActionLoading(userId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la désactivation');
      
      setSuccess('Utilisateur désactivé avec succès !');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Ouvrir le modal de modification
  const openEditModal = (user) => {
    setEditUser({
      user_id: user.user_id,
      matricule: user.matricule,
      nom: user.nom,
      email: user.email,
      password: ''
    });
    setShowEditModal(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const getStatusColor = (status) => {
    return status === 'Actif' ? 'bg-green-500 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role) => {
    return role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold  mb-2">Gestion des Utilisateurs</h1>
            <p className="text-slate-600">Gérez les comptes utilisateurs du système</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Ajouter un utilisateur
          </button>
        </div>

        {/* Messages de succès/erreur */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserX className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Tableau des utilisateurs */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-12 h-12 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-600 to-cyan-600  text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Matricule</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nom</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Rôle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date de création</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {Users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{user.matricule}</td>
                      <td className="px-6 py-4 text-slate-700">{user.nom}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role_name)}`}>
                          {user.role_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(user.timestamp)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Détails"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                           onClick={() => setUserToDelete(collect)}

                            disabled={actionLoading === user.user_id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Désactiver"
                          >
                            {actionLoading === user.user_id ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <UserX className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, users.length)} sur {users.length} utilisateurs
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-slate-800 text-white'
                        : 'hover:bg-white border border-slate-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold">Ajouter un utilisateur</h2>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-green-700 rounded-lg p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Matricule *</label>
                  <input
                    type="number"
                    value={newUser.matricule}
                    onChange={(e) => setNewUser({...newUser, matricule: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={newUser.nom}
                    onChange={(e) => setNewUser({...newUser, nom: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rôle *</label>
                <select
                  value={newUser.role_id}
                  onChange={(e) => setNewUser({...newUser, role_id: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un rôle</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={actionLoading === 'create'}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading === 'create' ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Créer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold">Modifier l'utilisateur</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-blue-700 rounded-lg p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Matricule</label>
                  <input
                    type="number"
                    value={editUser.matricule}
                    onChange={(e) => setEditUser({...editUser, matricule: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={editUser.nom}
                    onChange={(e) => setEditUser({...editUser, nom: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe (optionnel)</label>
                <input
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Laisser vide pour ne pas changer"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={actionLoading === 'update'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading === 'update' ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Mettre à jour
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {selectedUser && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold">Détails de l'utilisateur</h2>
              <button onClick={() => setSelectedUser(null)} className="hover:bg-slate-700 rounded-lg p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-slate-800">Informations Générales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">User ID</p>
                    <p className="font-mono text-sm text-slate-800">{selectedUser.user_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Matricule</p>
                    <p className="text-slate-800">{selectedUser.matricule}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Nom</p>
                    <p className="text-slate-800 font-medium">{selectedUser.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-slate-800">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-slate-800">Rôle & Permissions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Nom du rôle</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getRoleColor(selectedUser.role_name)}`}>
                      {selectedUser.role_name}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Role ID</p>
                    <p className="font-mono text-xs text-slate-800">{selectedUser.role_id}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-slate-800">Statut du compte</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date de création</p>
                    <p className="text-slate-800">{formatDate(selectedUser.timestamp)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  openEditModal(selectedUser);
                  setSelectedUser(null);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de delete */}
     {userToDelete && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-[zoomIn_.25s_ease]">
      <div className="px-6 py-5 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Confirmer la suppression</h2>
        <button
          onClick={() => setUserToDelete(null)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="p-6 text-slate-700 space-y-2">
        <p className="font-medium">
          Tu es sur le point de supprimer l’utilisateur :
        </p>
        <p className="text-slate-900 font-semibold">
          {userToDelete.nom} ({userToDelete.email})
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Cette action est irréversible.
        </p>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-xl">
        <button
          onClick={() => setUserToDelete(null)}
          className="px-5 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
        >
          Annuler
        </button>
        <button
          onClick={() => handleDelete(userToDelete.user_id)}
          className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Supprimer définitivement
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Users;