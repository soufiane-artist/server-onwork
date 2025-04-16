"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// router user
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// All routes are protected
router.route('/')
    .get(user_controller_1.getUsers);
router.route('/:id')
    .get(user_controller_1.getUserById)
    .put(user_controller_1.updateUser)
    .delete(user_controller_1.deleteUser);
exports.default = router;
