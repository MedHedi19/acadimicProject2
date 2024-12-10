const router = require('express').Router();
const authController = require("../controllers/authControllers");
const { checkAuth, checkOwner } = require('../middleware/verifyToken');

router.post('/login', authController.Login);
router.post('/staffLogin', authController.StaffLogin);
router.get('/getStaff', checkAuth, checkOwner, authController.getStaffUsers);
router.get('/getClient', checkAuth, authController.getClient);
router.post('/addUser', checkAuth, authController.addUser);
router.delete('/:userId', checkAuth, authController.deleteUser);
router.get('/getPersonalInfo', checkAuth, authController.getPersonalInfo);
router.get('/getUserById/:userId', checkAuth, authController.getUserById);
router.put('/editPersonalInfo', checkAuth, authController.editPersonalInfo);

module.exports = router;
