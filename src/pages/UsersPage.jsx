import React, { useState, useEffect, useMemo } from 'react';
import { Trash2, Eye, Edit, UserX, UserCheck, Shield, Mail, Calendar, X, Save, Loader, Check, Ban, Search, Filter } from 'lucide-react';

const UsersPage = () => {
  // Données simulées
  const UsersSimulated = [
    { user_id: '1', name: 'Junior Njoya', matricule: 'ELec74834', role_name: 'ADMIN', email: 'junior.njoya@elecit.net', statuts: 'Actif', timestamp: '2025-10-01T10:00:00Z' },
    { user_id: '2', name: 'Erika Mustermann', matricule: 'ELec74835', role_name: 'MANAGER', email: 'erika.m@elecit.net', statuts: 'Inactif', timestamp: '2025-09-15T15:30:00Z' },
    { user_id: '3', name: 'Max Muster', matricule: 'ELec74836', role_name: 'MANAGER', email: 'max.m@elecit.net', statuts: 'Actif', timestamp: '2025-10-20T08:45:00Z' },
    { user_id: '4', name: 'Sophie Dupont', matricule: 'ELec74837', role_name: 'ADMIN', email: 'sophie.d@elecit.net', statuts: 'Inactif', timestamp: '2025-11-05T11:20:00Z' },
    { user_id: '5', name: 'David Smith', matricule: 'ELec74838', role_name: 'MANAGER', email: 'david.s@elecit.net', statuts: 'Actif', timestamp: '2025-11-10T09:00:00Z' },
    { user_id: '6', name: 'Maria Lopez', matricule: 'ELec74839', role_name: 'MANAGER', email: 'maria.l@elecit.net', statuts: 'Actif', timestamp: '2025-11-11T14:00:00Z' },
    { user_id: '7', name: 'Ahmed Ali', matricule: 'ELec74840', role_name: 'ADMIN', email: 'ahmed.a@elecit.net', statuts: 'Actif', timestamp: '2025-11-12T16:00:00Z' },
    { user_id: '8', name: 'Chloé Martin', matricule: 'ELec74841', role_name: 'MANAGER', email: 'chloe.m@elecit.net', statuts: 'Inactif', timestamp: '2025-11-13T07:30:00Z' },
    { user_id: '9', name: 'Pierre Dubois', matricule: 'ELec74842', role_name: 'ADMIN', email: 'pierre.d@elecit.net', statuts: 'Actif', timestamp: '2025-11-14T10:45:00Z' },
    { user_id: '10', name: 'Fatima Zahra', matricule: 'ELec74843', role_name: 'MANAGER', email: 'fatima.z@elecit.net', statuts: 'Actif', timestamp: '2025-11-15T12:00:00Z' },
    { user_id: '11', name: 'Marc Leblanc', matricule: 'ELec74844', role_name: 'MANAGER', email: 'marc.l@elecit.net', statuts: 'Inactif', timestamp: '2025-11-16T18:00:00Z' },
    { user_id: '12', name: 'Léa Roy', matricule: 'ELec74845', role_name: 'ADMIN', email: 'lea.r@elecit.net', statuts: 'Actif', timestamp: '2025-11-17T09:30:00Z' },
  ];

  const [users, setUsers] = useState(UsersSimulated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);
  const [userToToggle, setUserToToggle] = useState(null);
  const [loadingToggle, setLoadingToggle] = useState(false);

  // --- États pour le filtrage et la recherche ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  // ----------------------------------------------

  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(false);
  }, []);

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

  // SIMULATION: Créer un nouvel utilisateur
  const handleCreateUser = () => {
    if (!newUser.nom || !newUser.email || !newUser.matricule || !newUser.password || !newUser.role_id) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setActionLoading('create');
    setError(null);
    setSuccess(null);

    setTimeout(() => {
      const newUserId = (users.length + 1).toString();
      const newUserData = {
        user_id: newUserId,
        name: newUser.nom,
        matricule: newUser.matricule,
        role_name: roles.find(r => r.id === newUser.role_id)?.name || 'N/A',
        email: newUser.email,
        statuts: 'Actif',
        timestamp: new Date().toISOString(),
      };

      setUsers(prev => [newUserData, ...prev]);
      setSuccess('Utilisateur créé avec succès !');
      setShowAddModal(false);
      setNewUser({ matricule: '', nom: '', email: '', password: '', role_id: '' });
      setActionLoading(null);
    }, 1500);
  };

  // SIMULATION: Mettre à jour un utilisateur
  const handleUpdateUser = () => {
    if (!editUser.nom || !editUser.email || !editUser.matricule) {
        setError("Veuillez remplir les champs obligatoires.");
        return;
    }
    setActionLoading('update');
    setError(null);
    setSuccess(null);

    setTimeout(() => {
      setUsers(prev => prev.map(u => u.user_id === editUser.user_id ? {
        ...u,
        name: editUser.nom,
        matricule: editUser.matricule,
        email: editUser.email,
      } : u));

      setSuccess('Utilisateur mis à jour avec succès !');
      setShowEditModal(false);
      setActionLoading(null);
    }, 1500);
  };

  // SIMULATION: Supprimer un utilisateur
  const handleDelete = (userId) => {
    setActionLoading(userId);
    setError(null);
    setSuccess(null);
    setUserToDelete(null);

    setTimeout(() => {
      setUsers(prev => prev.filter(u => u.user_id !== userId));
      setSuccess('Utilisateur supprimé avec succès (simulation) !');
      setActionLoading(null);
    }, 1500);
  };

  // Ouvrir le modal de modification
  const openEditModal = (user) => {
    setEditUser({
      user_id: user.user_id,
      matricule: user.matricule,
      nom: user.name,
      email: user.email,
      password: ''
    });
    setShowEditModal(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
    } catch (e) {
        return 'Date invalide';
    }
  };

  const toggleUersStatus = (user) => {
    setUserToToggle(user);
  }

  const confirmToggleStatus = () => {
    setLoadingToggle(true);
    setError(null);
    setSuccess(null);

    setTimeout(() => {
      setUsers(prev =>
        prev.map(u =>
          u.user_id === userToToggle.user_id
            ? { ...u, statuts: u.statuts === 'Actif' ? 'Inactif' : 'Actif' }
            : u
        )
      );
      setSuccess(`Statut de l'utilisateur ${userToToggle.name} changé en ${userToToggle.statuts === 'Actif' ? 'Inactif' : 'Actif'}.`);
      setLoadingToggle(false);
      setUserToToggle(null);
    }, 1000);
  };
  
  // Composant de Toggle visuel 'professionnel'
  const StatusToggle = ({ user }) => {
    const isActif = user.statuts === 'Actif';
    const toggleHandler = (e) => {
      e.stopPropagation(); 
      toggleUersStatus(user);
    };

    return (
      <div className='flex items-center'>
        <button
          onClick={toggleHandler}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActif ? 'bg-green-500' : 'bg-red-500'} shadow-md`}
          aria-checked={isActif}
          role="switch"
        >
          <span
            className={`transform transition ease-in-out duration-300 inline-block w-4 h-4 rounded-full bg-white ml-1 flex items-center justify-center ${
              isActif ? 'translate-x-5 text-green-500' : 'translate-x-0 text-red-500'
            }`}
          >
            {isActif ? <Check className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
          </span>
        </button>
        <span className={`ml-3 text-sm font-medium ${isActif ? 'text-green-600' : 'text-red-600'}`}>
            {user.statuts}
        </span>
      </div>
    );
  };

  // --- LOGIQUE DE RECHERCHE ET FILTRAGE ---
  const filteredUsers = useMemo(() => {
    let computedUsers = [...users];

    // 1. Filtrage par Rôle
    if (filterRole) {
      computedUsers = computedUsers.filter(user => user.role_name === filterRole);
    }

    // 2. Filtrage par Statut
    if (filterStatus) {
      computedUsers = computedUsers.filter(user => user.statuts === filterStatus);
    }

    // 3. Recherche globale
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      computedUsers = computedUsers.filter(user => 
        user.name.toLowerCase().includes(lowerCaseSearch) ||
        user.matricule.toLowerCase().includes(lowerCaseSearch) ||
        user.email.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Réinitialiser la pagination après le filtrage/la recherche
    setCurrentPage(1); 

    return computedUsers;
  }, [users, searchTerm, filterRole, filterStatus]);
  
  // --- PAGINATION (basée sur les utilisateurs filtrés) ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  // ------------------------------------------------------


  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Gestion des Utilisateurs</h1>
            <p className="text-slate-600">Gérez les comptes utilisateurs du système.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200/50 flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Ajouter un utilisateur
          </button>
        </div>

        {/* Messages de succès/erreur */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-green-600" />
              <span className="font-medium">{success}</span>
            </div>
            <button onClick={() => setSuccess(null)} className="p-1 rounded-full hover:bg-green-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <UserX className="w-6 h-6 text-red-600" />
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-red-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Barre de Recherche et Filtrage */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-slate-200 flex flex-wrap gap-4 items-center">
            <Filter className="w-5 h-5 text-slate-500" />
            <div className="relative flex-grow min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher par nom, matricule ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition"
                />
            </div>

            <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white shadow-sm transition min-w-[150px]"
            >
                <option value="">Tous les Rôles</option>
                {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                ))}
            </select>

            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white shadow-sm transition min-w-[150px]"
            >
                <option value="">Tous les Statuts</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
            </select>
        </div>
        
        {/* Tableau des utilisateurs */}
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-lg">
            <Loader className="w-12 h-12 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gradient-to-r from-green-600 to-cyan-600 text-white sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Matricule</th>
                    <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Rôle</th>
                    <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Date de création</th>
                    <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentUsers.map((user, index) => (
                    <tr 
                        key={user.user_id} 
                        className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 cursor-pointer`}
                        onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">{user.matricule}</td>
                      <td className="px-6 py-4 text-slate-700">{user.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role_name)} shadow-sm`}>
                          {user.role_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusToggle user={user} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span>{formatDate(user.timestamp)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-all"
                            title="Détails"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-all"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setUserToDelete(user); }}
                            disabled={actionLoading === user.user_id}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all disabled:opacity-50"
                            title="Supprimer"
                          >
                            {actionLoading === user.user_id ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentUsers.length === 0 && (
                      <tr>
                          <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                              Aucun utilisateur trouvé pour les critères de recherche ou de filtre.
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Affichage de **{indexOfFirstItem + 1}** à **{Math.min(indexOfLastItem, filteredUsers.length)}** sur **{filteredUsers.length}** utilisateurs ({users.length} au total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-slate-200 transition-colors text-slate-700"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      currentPage === page
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'hover:bg-slate-200 border border-slate-300 text-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-slate-200 transition-colors text-slate-700"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals (inchangés) */}
      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-[zoomIn_.25s_ease]">
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold">Ajouter un utilisateur</h2>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-green-700 rounded-full p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Matricule *</label>
                  <input
                    type="text"
                    value={newUser.matricule}
                    onChange={(e) => setNewUser({...newUser, matricule: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={newUser.nom}
                    onChange={(e) => setNewUser({...newUser, nom: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rôle *</label>
                <select
                  value={newUser.role_id}
                  onChange={(e) => setNewUser({...newUser, role_id: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
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
                  className="px-6 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={actionLoading === 'create' || !newUser.matricule || !newUser.nom || !newUser.email || !newUser.password || !newUser.role_id}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 font-medium"
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
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-[zoomIn_.25s_ease]">
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold">Modifier l'utilisateur</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-blue-700 rounded-full p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Matricule</label>
                  <input
                    type="text"
                    value={editUser.matricule}
                    onChange={(e) => setEditUser({...editUser, matricule: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={editUser.nom}
                    onChange={(e) => setEditUser({...editUser, nom: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe (optionnel)</label>
                <input
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Laisser vide pour ne pas changer"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={actionLoading === 'update'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
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
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-[zoomIn_.25s_ease]">
            <div className="sticky top-0 bg-slate-800 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold">Détails de l'utilisateur</h2>
              <button onClick={() => setSelectedUser(null)} className="hover:bg-slate-700 rounded-full p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-lg p-4 shadow-inner">
                <h3 className="font-semibold text-lg mb-3 text-slate-800 border-b pb-2">Informations Générales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">User ID</p>
                    <p className="font-mono text-sm text-slate-800 break-all">{selectedUser.user_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Matricule</p>
                    <p className="text-slate-800 font-medium">{selectedUser.matricule}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Nom</p>
                    <p className="text-slate-800 font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-slate-800">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 shadow-inner">
                <h3 className="font-semibold text-lg mb-3 text-slate-800 border-b border-purple-200 pb-2">Rôle & Statut</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Nom du rôle</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getRoleColor(selectedUser.role_name)} shadow-md`}>
                      {selectedUser.role_name}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${selectedUser.statuts === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-md`}>
                      {selectedUser.statuts}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-medium"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  openEditModal(selectedUser);
                  setSelectedUser(null);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression (delete) */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-[zoomIn_.25s_ease]">
            <div className="px-6 py-5 border-b flex items-center justify-between bg-red-600 rounded-t-xl">
              <h2 className="text-xl font-bold text-white">Confirmer la suppression</h2>
              <button
                onClick={() => setUserToDelete(null)}
                className="p-2 rounded-full hover:bg-red-700 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-slate-700 space-y-3">
              <p className="font-medium text-lg flex items-center gap-2 text-red-700">
                <Trash2 className="w-6 h-6" />
                Attention !
              </p>
              <p>
                Vous êtes sur le point de **supprimer définitivement** l’utilisateur :
              </p>
              <p className="text-slate-900 font-bold bg-red-50 p-3 rounded-lg border border-red-200">
                {userToDelete.name} ({userToDelete.email})
              </p>
              <p className="text-sm text-red-500 mt-2">
                Cette action est **irréversible** dans un environnement réel.
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(userToDelete.user_id)}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium disabled:opacity-50 flex items-center gap-2"
                disabled={actionLoading === userToDelete.user_id}
              >
                 {actionLoading === userToDelete.user_id && <Loader className="w-5 h-5 animate-spin" />}
                 Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal confirmation toggling */}
      { userToToggle && (
        <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-[zoomIn_.25s_ease]'>
            <div className='flex justify-between items-start border-b pb-3 mb-4'>
              <h2 className='text-xl font-bold text-slate-800'>
                Confirmation du changement de statut
              </h2>
              <button onClick={() => setUserToToggle(null)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <p className='mb-6 text-center text-slate-700'>
              Voulez-vous vraiment **{userToToggle.statuts === 'Actif' ? 'désactiver' : 'activer'}** l'utilisateur&nbsp;:
              <br />
              <strong className='text-slate-900 bg-slate-100 px-3 py-1 rounded-md inline-block mt-2'>{userToToggle.name} ({userToToggle.email})</strong>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setUserToToggle(null)}
                disabled={loadingToggle}
                className="px-5 py-2 bg-slate-200 rounded-xl hover:bg-slate-300 transition font-medium text-slate-700"
              >
                Annuler
              </button>
              <button
                onClick={confirmToggleStatus}
                disabled={loadingToggle}
                className={`px-5 py-2 text-white rounded-xl transition flex items-center gap-2 font-medium ${
                    userToToggle.statuts === 'Actif' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loadingToggle && <Loader className="w-5 h-5 animate-spin" />}
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;