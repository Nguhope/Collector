import React, { useState, useMemo } from 'react';
import { 
    Trash2, Edit, X, Save, Loader, Key, Settings, Plus, List, Lock, 
    User, AlertTriangle, CheckCircle, Info
} from 'lucide-react';

// --- Données Simulées pour le RBAC (Elles devraient venir d'un store global ou d'un appel API) ---
const PermissionsSimulated = [
    { permission_id: 'p001', ressource: 'users', action: 'read', description: 'Afficher tous les utilisateurs' },
    { permission_id: 'p002', ressource: 'users', action: 'write', description: 'Créer/Modifier un utilisateur' },
    { permission_id: 'p003', ressource: 'users', action: 'delete', description: 'Supprimer un utilisateur' },
    { permission_id: 'p004', ressource: 'roles', action: 'read', description: 'Afficher tous les rôles' },
    { permission_id: 'p005', ressource: 'roles', action: 'write', description: 'Créer/Modifier un rôle' },
    { permission_id: 'p006', ressource: 'roles', action: 'delete', description: 'Supprimer un rôle' },
    { permission_id: 'p007', ressource: 'collecte', action: 'start', description: 'Démarrer une collecte de données' },
    { permission_id: 'p008', ressource: 'collecte', action: 'view_history', description: 'Voir l\'historique de collecte' },
];

const RolesSimulated = [
    { 
        role_id: 'r001', 
        name: 'ADMIN', 
        description: 'Accès complet au système, y compris la gestion RBAC.', 
        permissions: PermissionsSimulated.map(p => p.permission_id),
        timestamp: '2025-01-01T00:00:00Z'
    },
    { 
        role_id: 'r002', 
        name: 'MANAGER', 
        description: 'Peut gérer les utilisateurs et démarrer les collectes.', 
        permissions: ['p001', 'p002', 'p007', 'p008'],
        timestamp: '2025-01-01T00:00:00Z'
    }
];

// --- Fonctions utilitaires ---
const getRoleColor = (roleName) => {
    switch (roleName) {
        case 'ADMIN': return 'bg-purple-100 text-purple-800';
        case 'MANAGER': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-lg font-medium border-b-2 transition-all duration-200 ${
            isActive 
                ? 'border-green-600 text-green-700 bg-green-50 shadow-inner rounded-t-lg' 
                : 'border-transparent text-blue-500 hover:text-blue-600 hover:border-blue-300'
        }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);


const SecurityPage = ({ setRolesForUsersPage }) => { // Simule le passage des rôles à UsersPage
    
    const [activeTab, setActiveTab] = useState('roles'); // 'roles', 'permissions'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    // --- États RBAC (Rôles & Permissions) ---
    const [roles, setRoles] = useState(RolesSimulated);
    const [permissions, setPermissions] = useState(PermissionsSimulated);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState(null);
    const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] });

    // Envoi des rôles mis à jour à UsersPage (Simulation)
    // useEffect(() => {
    //     if (setRolesForUsersPage) {
    //         setRolesForUsersPage(roles);
    //     }
    // }, [roles, setRolesForUsersPage]);
    
    const dismissAlerts = () => { setError(null); setSuccess(null); };

    // --- LOGIQUE RBAC RÔLES ---

    const openRoleModal = (role = null) => {
        dismissAlerts();
        if (role) {
            setRoleToEdit(role);
            setNewRole({
                name: role.name,
                description: role.description,
                permissions: [...role.permissions] // Utiliser les IDs de permission
            });
        } else {
            setRoleToEdit(null);
            setNewRole({ name: '', description: '', permissions: [] });
        }
        setShowRoleModal(true);
    };

    const handlePermissionToggle = (permissionId) => {
        setNewRole(prev => {
            const currentPermissions = prev.permissions;
            if (currentPermissions.includes(permissionId)) {
                return { ...prev, permissions: currentPermissions.filter(id => id !== permissionId) };
            } else {
                return { ...prev, permissions: [...currentPermissions, permissionId] };
            }
        });
    };

    // SIMULATION: Créer/Modifier un Rôle (POST /roles/create ou PUT /roles/update)
    const handleSaveRole = () => {
        if (!newRole.name || !newRole.description) {
            setError("Le nom et la description du rôle sont obligatoires.");
            return;
        }
        setActionLoading('save_role');
        dismissAlerts();

        setTimeout(() => {
            const isEditing = !!roleToEdit;
            let updatedRoles;
            let message;

            if (isEditing) {
                // Mise à jour (PUT /roles/update)
                updatedRoles = roles.map(r => r.role_id === roleToEdit.role_id ? {
                    ...r,
                    name: newRole.name,
                    description: newRole.description,
                    permissions: newRole.permissions,
                } : r);
                message = `Rôle "${newRole.name}" mis à jour avec succès !`;
            } else {
                // Création (POST /roles/create)
                const newRoleId = `r${(roles.length + 1).toString().padStart(3, '0')}`;
                const newRoleData = {
                    role_id: newRoleId,
                    name: newRole.name,
                    description: newRole.description,
                    permissions: newRole.permissions,
                    timestamp: new Date().toISOString(),
                };
                updatedRoles = [...roles, newRoleData];
                message = `Rôle "${newRole.name}" créé avec succès !`;
            }

            setRoles(updatedRoles);
            setSuccess(message);
            setShowRoleModal(false);
            setActionLoading(null);
        }, 1500);
    };

    // SIMULATION: Supprimer un Rôle (DELETE /roles/{role_id})
    const handleDeleteRole = (roleId) => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible et affectera les utilisateurs associés.")) {
            setActionLoading(roleId);
            dismissAlerts();
            
            setTimeout(() => {
                const updatedRoles = roles.filter(r => r.role_id !== roleId);
                // Dans une vraie application, vous feriez ici un appel API pour mettre à jour les utilisateurs impactés.
                setRoles(updatedRoles);
                setSuccess('Rôle supprimé avec succès (simulation) !');
                setActionLoading(null);
            }, 1500);
        }
    };
    
    // --- RENDU PARTIEL : Section Rôles ---
    const renderRolesTab = () => (
        <>
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => openRoleModal(null)}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200/50 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Créer un nouveau Rôle
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Nom du Rôle</th>
                                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Permissions Attribuées</th>
                                <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {roles.map((role, index) => (
                                <tr key={role.role_id} className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100`}>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(role.name)} shadow-sm`}>
                                            {role.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 max-w-sm">{role.description}</td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{role.permissions.length} Permissions</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openRoleModal(role)}
                                                className="p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-all"
                                                title="Modifier le Rôle"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRole(role.role_id)}
                                                disabled={actionLoading === role.role_id || role.name === 'ADMIN'}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all disabled:opacity-50"
                                                title="Supprimer le Rôle"
                                            >
                                                {actionLoading === role.role_id ? (
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    // --- RENDU PARTIEL : Section Permissions ---
    const renderPermissionsTab = () => (
        <>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg mb-6">
                <p className="font-semibold flex items-center gap-2"><List className="w-5 h-5"/> Liste des Permissions de Base</p>
                <p className="text-sm">Cette liste définit les actions possibles sur les ressources. Elles sont gérées via l'API. (Total: **{permissions.length}**)</p>
            </div>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Ressource</th>
                                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {permissions.map((p, index) => (
                                <tr key={p.permission_id} className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.permission_id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{p.ressource}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.action === 'read' ? 'bg-green-100 text-green-800' : p.action === 'write' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                            {p.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">{p.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    // --- RENDU PRINCIPAL ---
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
                        <Lock className="w-8 h-8 text-green-600"/>
                        Gestion de la Sécurité
                    </h1>
                    <p className="">Définissez les rôles et attribuez les permissions d'accès aux ressources du système.</p>
                </div>
                
                {/* Navigation par Onglets */}
                <div className="mb-8 border-b border-slate-200">
                    <nav className="flex space-x-4">
                        <TabButton 
                            icon={Lock} 
                            label="Rôles" 
                            isActive={activeTab === 'roles'} 
                            onClick={() => setActiveTab('roles')}
                        />
                        <TabButton 
                            icon={Key} 
                            label="Permissions" 
                            isActive={activeTab === 'permissions'} 
                            onClick={() => setActiveTab('permissions')}
                        />
                    </nav>
                </div>

                {/* Messages de succès/erreur */}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
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
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <span className="font-medium">{error}</span>
                        </div>
                        <button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-red-200">
                        <X className="w-5 h-5" />
                        </button>
                    </div>
                )}


                {/* Contenu des Onglets */}
                {loading ? (
                    <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-lg">
                        <Loader className="w-12 h-12 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <>
                        {activeTab === 'roles' && renderRolesTab()}
                        {activeTab === 'permissions' && renderPermissionsTab()}
                    </>
                )}
            </div>

            {/* Modal de création/modification de Rôle */}
            {showRoleModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-[zoomIn_.25s_ease]">
                        <div className={`px-6 py-4 flex items-center justify-between rounded-t-xl ${roleToEdit ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                            <h2 className="text-2xl font-bold">{roleToEdit ? `Modifier le Rôle : ${roleToEdit.name}` : 'Créer un nouveau Rôle'}</h2>
                            <button onClick={() => setShowRoleModal(false)} className={`rounded-full p-2 ${roleToEdit ? 'hover:bg-amber-600' : 'hover:bg-green-700'}`}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Informations du Rôle */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2 text-slate-700 flex items-center gap-2"><Settings className="w-4 h-4"/> Détails du Rôle</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom du Rôle *</label>
                                        <input
                                            type="text"
                                            value={newRole.name}
                                            onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                        <textarea
                                            value={newRole.description}
                                            onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    {roleToEdit && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
                                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                                            Modifier les permissions ici mettra à jour ce rôle. Les utilisateurs avec ce rôle hériteront immédiatement des nouveaux droits.
                                        </div>
                                    )}
                                </div>

                                {/* Gestion des Permissions */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2 text-slate-700 flex items-center gap-2"><Key className="w-4 h-4"/> Permissions (<span className="text-green-600">{newRole.permissions.length}</span> sélectionnées)</h3>
                                    <div className="h-64 overflow-y-auto border p-3 rounded-lg bg-slate-50">
                                        <div className="space-y-3">
                                            {permissions.map(p => (
                                                <div key={p.permission_id} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-700">{p.ressource}:{p.action}</span>
                                                        <span className="text-xs text-slate-500">{p.description}</span>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            value={p.permission_id} 
                                                            checked={newRole.permissions.includes(p.permission_id)}
                                                            onChange={() => handlePermissionToggle(p.permission_id)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setShowRoleModal(false)}
                                    className="px-6 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveRole}
                                    disabled={actionLoading === 'save_role' || !newRole.name || !newRole.description}
                                    className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 font-medium"
                                >
                                    {actionLoading === 'save_role' ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Sauvegarde...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {roleToEdit ? 'Mettre à jour' : 'Créer le Rôle'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecurityPage;