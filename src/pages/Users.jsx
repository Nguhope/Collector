
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaCheck, FaTimes, FaUserShield, FaSpinner, FaToggleOn, FaToggleOff, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';


const Users = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTitle, setActiveTitle] = useState('');
  const [scrollY, setScrollY] = useState(0);

  // États pour le formulaire d'ajout d'utilisateur
  const [addFormLoading, setAddFormLoading] = useState(false);
  const [addFormSuccess, setAddFormSuccess] = useState(null);
  const [addFormError, setAddFormError] = useState(null);

  // État pour la liste des managers/admins
  // const [staffUsers, setStaffUsers] = useState([]);
  const [staffListLoading, setStaffListLoading] = useState(false);
  const [staffListError, setStaffListError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null); // Pour l'activation/désactivation

  // État pour le formulaire d'ajout d'utilisateur
  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: '',
    pwd: '', // Le nom exact "pwd" comme dans votre structure
    countryCode: 'CM', // Code ISO pour Cameroun, selon les standards
    role: 'USER', // Valeur par défaut
    pReferralCode: '' // Ajout du champ pReferralCode
  });
  
  const menuItems = [
    { title: 'Tableau de bord', path: '/dashboard' },
    { title: 'Transaction', path: '/transaction' },
    { title: 'Utilisateur', path: '/users' },
    { title: 'Cashback & Parrainage', path: '/cashback' },
    { title: 'Partenaires & Api', path: '/partners' },
    { title: 'Paramètres & Sécurité', path: '/settings' },
    { title: 'Support & Litiges', path: '/support' },
  ];

 const staffUsers = [
  {id:1, name:'Njoya', matricule:'10140', role:'ADMIN', accountStatus:'Active'},
  {id:2, name:'luffy', matricule:'10140', role:'MANAGER', accountStatus:'Desactive'},
  {id:3, name:'Eren jager', matricule:'10140', role:'ADMIN', accountStatus:'Active'},
 ]

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Logique de récupération des Managers et Admins ---


  // --- Logique d'activation/désactivation d'un Manager ---
  const handleToggleManagerStatus = async (userId, currentStatus) => {
    setUpdatingUserId(userId);
    setStaffListError(null); // Clear previous errors for list
    try {
      const newStatus = currentStatus === 'Active' ? 'false' : 'true'; // Convertir en string pour l'URL
      await authFetch(`${API_BASE_URL}/api/v1/user/staff/${userId}?activate=${newStatus}`, {
        method: 'PUT',
      });
      
      // Mettre à jour l'état local de l'utilisateur pour refléter le changement
      setStaffUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, accountStatus: currentStatus === 'Active' ? 'Inactive' : 'Active' } : user
        )
      );
      setAddFormSuccess("Statut du manager mis à jour avec succès!"); // Utilise le succès du formulaire pour un feedback global
    } catch (err) {
      console.error(`Erreur lors de la mise à jour du statut du manager ${userId}:`, err);
      setStaffListError(err.response?.data?.message || `Échec de la mise à jour du statut du manager ${userId}.`);
    } finally {
      setUpdatingUserId(null);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const validateForm = () => {
    // Vérification des champs requis
    if (!userData.fname || !userData.lname || !userData.email || !userData.countryCode || !userData.pwd || !userData.phone) {
      setAddFormError("Tous les champs marqués * sont obligatoires");
      return false;
    }
    
    // Vérification de l'e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setAddFormError("Veuillez entrer une adresse e-mail valide");
      return false;
    }
    
    // Vérification du mot de passe
    if (userData.pwd.length < 6) {
      setAddFormError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    
    // Vérification de la confirmation du mot de passe
    if (userData.pwd !== userData.confirmPwd) {
      setAddFormError("Les mots de passe ne correspondent pas");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setAddFormLoading(true);
    setAddFormError(null);
    setAddFormSuccess(null);
    
    try {
      // Préparation des données dans l'ordre spécifié
      const submitData = {
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
        pwd: userData.pwd,
        phone: userData.phone,
        countryCode: userData.countryCode,
        role: userData.role,
        // pReferralCode est inclus s'il a une valeur, sinon omis ou vide selon l'API
        ...(userData.pReferralCode && { pReferralCode: userData.pReferralCode })
      };

      let endpoint = '';
      let method = '';

      if (userData.role === 'ADMIN' || userData.role === 'MANAGER') {
        endpoint = `${API_BASE_URL}/api/v1/user/staff`;
        method = 'POST'; // C'est un POST pour la création de STAFF
      } else {
        endpoint = `${API_BASE_URL}/auth/account/signin`;
        method = 'POST'; // C'est un POST pour la création d'utilisateur normal (USER)
      }
      
      const response = await authFetch(endpoint, {
        method: method,
        data: submitData
      });
      
      console.log('Réponse API:', response.data);
      
      setAddFormSuccess(`L'utilisateur "${userData.role}" a été créé avec succès!`);
      
      // Réinitialiser le formulaire
      setUserData({
        fname: '',
        lname: '',
        phone: '',
        email: '',
        pwd: '',
        countryCode: 'CM',
        role: 'USER',
        confirmPwd: '',
        pReferralCode: ''
      });

      // Si un ADMIN ou MANAGER a été créé, rafraîchir la liste
      if (userData.role === 'ADMIN' || userData.role === 'MANAGER') {
        fetchStaffUsers();
      }
      
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      setAddFormError(err.response?.data?.message || "Une erreur est survenue lors de la création de l'utilisateur");
    } finally {
      setAddFormLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
    

        <main className="flex-1 p-6 bg-violet-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-green-600">
                Ajouter un Nouvel Utilisateur
              </h1>
              <p className="text-gray-600 mt-1">Remplissez le formulaire ci-dessous pour créer un nouvel utilisateur (ADMIN ou MANAGER).</p>
            </div>

            {addFormError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <div className="flex items-center">
                  <FaTimes className="mr-2" />
                  <p>{addFormError}</p>
                </div>
              </div>
            )}

            {addFormSuccess && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                <div className="flex items-center">
                  <FaCheck className="mr-2" />
                  <p>{addFormSuccess}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="matricule">
                    Matricule <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="matricule"
                      id="matricule"
                      name="matricule"
                      value={userData.matricule}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder=""
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="pwd">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="pwd"
                      name="pwd"
                      value={userData.pwd}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="******"
                      required
                      minLength="6"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Le mot de passe doit contenir au moins 6 caractères
                  </p>
                </div>
                
              </div>
              
              {/* Rôle et CountryCode (hidden) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserShield className="text-gray-400" />
                    </div>
                    <select
                      id="role"
                      name="role"
                      value={userData.role}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      required
                    >
                      <option value="MANAGER">Gestionnaire</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="confirmPwd">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPwd"
                      name="confirmPwd"
                      value={userData.confirmPwd}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="******"
                      required
                    />
                  </div>
                </div>
              
              
                {/* )} */}
              </div>

           

              {/* Boutons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setUserData({
                      fname: '',
                      lname: '',
                      phone: '',
                      email: '',
                      pwd: '',
                      countryCode: 'CM',
                      role: 'USER',
                      confirmPwd: '',
                      pReferralCode: ''
                    });
                    setAddFormError(null);
                    setAddFormSuccess(null);
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors ${addFormLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={addFormLoading}
                >
                  {addFormLoading ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Création en cours...
                    </span>
                  ) : 'Créer l\'utilisateur'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Section pour afficher les Administrateurs et Gestionnaires */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 mt-8"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-6">Administrateurs & Gestionnaires Existants</h2>
            
            {staffListLoading && (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin text-green-600 text-3xl" />
                <p className="ml-3 text-lg text-gray-700">Chargement des utilisateurs...</p>
              </div>
            )}

            {staffListError && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                <FaTimesCircle className="mr-2 text-xl" />
                <p>{staffListError}</p>
              </div>
            )}

         
              
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom Complet
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Matricule
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staffUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name} 
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                           {user.matricule}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'ADMIN' ? 'bg-purple-100 text-green-600' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.accountStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {user.role === 'MANAGER' && ( // Seuls les managers peuvent être activés/désactivés
                              <button
                                onClick={() => handleToggleManagerStatus(user.id, user.accountStatus)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-md text-white text-sm font-medium transition-colors ${
                                  user.accountStatus === 'Active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                } ${updatingUserId === user.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={updatingUserId === user.id}
                                title={user.accountStatus === 'Active' ? 'Désactiver le manager' : 'Activer le manager'}
                              >
                                {updatingUserId === user.id ? (
                                  <FaSpinner className="animate-spin mr-2" />
                                ) : (
                                  user.accountStatus === 'Active' ? <FaToggleOff className="mr-2 text-lg" /> : <FaToggleOn className="mr-2 text-lg" />
                                )}
                                {user.accountStatus === 'Active' ? 'Désactiver' : 'Activer'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Users;