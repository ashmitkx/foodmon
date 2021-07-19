import { Router } from 'express';
const router = Router();

router.route('/').post((_, res) => res.send('/ : post')); // create new user

router
    .route('/:id')
    .get((req, res) => res.send(`/${req.params.id} : get`)) // get user data
    .patch((req, res) => res.send(`/${req.params.id} : patch`)); // update user

export default router;
