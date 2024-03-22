import { HttpResponse } from "../utils/response/http.response.js";
import { errorsDictionary } from "../utils/response/errors-dictionary.response.js";
import { logger } from "../utils/logger/logger.js";
const httpResponse = new HttpResponse();

export default class Controllers {
    constructor(service) {
        this.service = service;
    }

    getAll = async (req, res, next) => {
        try {
            const items = await this.service.getAll();
            httpResponse.Ok(res, items);
        } catch (error) {
            logger.error(
                `desde class.controller.js - Error en getAll = ${error}`
            );
            next(error.message);
        }
    };

    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const item = await this.service.getById(id);
            if (!item)
                httpResponse.NotFound(res, errorsDictionary.ERROR_FETCH_ITEMS);
            else httpResponse.Ok(res, item);
        } catch (error) {
            logger.error(
                `desde class.controller.js - Error en getById = ${error}`
            );
            next(error.message);
        }
    };

    create = async (req, res, next) => {
        try {
            const obj = req.body;
            const newItem = await this.service.create(obj);
            if (!newItem)
                httpResponse.NotFound(res, errorsDictionary.ERROR_CREATE_ITEM);
            else
                httpResponse.Ok(res, {
                    newItem,
                    msg: `item created successfully`,
                });
        } catch (error) {
            logger.error(
                `desde class.controller.js - Error en create = ${error}`
            );
            next(error.message);
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const item = await this.service.getById(id);
            if (!item)
                httpResponse.NotFound(res, errorsDictionary.ERROR_UPDATE_ITEM);
            const itemUpd = await this.service.update(id, req.body);
            httpResponse.Ok(res, {
                itemUpd,
                msg: `ID ${id} updated successfully`,
            });
        } catch (error) {
            logger.error(
                `desde class.controller.js - Error en update = ${error}`
            );
            next(error.message);
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const item = await this.service.getById(id);
            if (!item)
                httpResponse.NotFound(res, errorsDictionary.ERROR_DELETE_ITEM);
            const itemUpd = await this.service.delete(id);
            httpResponse.Ok(res, {
                itemUpd,
                msg: `ID ${id} deleted successfully`,
            });
        } catch (error) {
            logger.error(
                `desde class.controller.js - Error en delete = ${error}`
            );
            next(error.message);
        }
    };
}
