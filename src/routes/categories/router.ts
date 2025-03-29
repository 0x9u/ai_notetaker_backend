import express from 'express';
import routeGetCategories from './get';

const categoriesRouter = express.Router();

categoriesRouter.get('/', routeGetCategories);

export default categoriesRouter;
