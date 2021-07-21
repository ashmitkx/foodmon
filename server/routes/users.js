import { Router } from 'express';
import usersApi from '../api/users.js';

const router = Router();

router.route('/').post((_, res) => res.send('/ : post')); // create new user

router.route('/:id').get((req, res) => res.send(`/${req.params.id} : get`)); // get basic user data

router.route('/:id/:resource').get(usersApi.getUserResource).patch().delete();

export default router;
