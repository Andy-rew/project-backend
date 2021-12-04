import { Request } from 'polka';
import { ServerResponse } from 'http';
import { Accident } from '../models/Accident';
import sendtype from '@polka/send-type';
import { Op } from 'sequelize';
import { People } from '../models/People';
import { Relation } from '../models/Relation';

export const getAccidents = async (req: Request, res: ServerResponse) => {
  const { rows: accidents, count } = await Accident.findAndCountAll();
  sendtype(res, 200, {accidents, count});
};

export const getPeople = async (req: Request, res: ServerResponse) => {
  const people = await People.findAll();
  sendtype(res, 200, {people});
};

export const getAccidentsOfPerson = async (req: Request, res: ServerResponse) => {
  const { count } = await Relation.findAndCountAll({where:{personId: req.params.id}});
  sendtype(res, 200, { count });
};

export const getAccidentsDate = async (req: Request, res: ServerResponse) => {
  const {start, end} = req.query;
  const { rows: accidents, count } = await Accident.findAndCountAll({where:{
    registerDate:  {
    [Op.between]: [
      start,
      end,
    ] as any,
  },
    }});

  sendtype(res, 200, {accidents, count});
};

export const deleteAccidents = async (req: Request, res: ServerResponse) => {
  const { id } = req.params;
  const accident = await Accident.findByPk(id);
  if (!accident) {
    return sendtype(res, 404, { message: 'Not found' });
  }
  await accident.destroy();
  sendtype(res, 200, {message: 'ok'});
};

export const deletePerson = async (req: Request, res: ServerResponse) => {
  const { id } = req.params;
  const person = await People.findByPk(id);
  if (!person) {
    return sendtype(res, 404, { message: 'Not found' });
  }
  await person.destroy();
  sendtype(res, 200, {message: 'ok'});
};



export const createAccident = async (req: Request, res: ServerResponse) => {
  const { accident }  = req.body;
  await Accident.create(accident);
  sendtype(res, 200, {message: 'ok'});
};

export const editPerson = async (req: Request, res: ServerResponse) => {
  const { id } = req.params;
  const { person }  = req.body;
  const personEdit = await People.findByPk(id);
  if (!personEdit) {
    return sendtype(res, 404, { message: 'Not found' });
  }
  await personEdit.update(person);
  sendtype(res, 200, {message: 'ok'});
};

export const editAccident = async (req: Request, res: ServerResponse) => {
  const { id } = req.params;
  const { accident }  = req.body;
  const accidentEdit = await Accident.findByPk(id);
  if (!accidentEdit) {
    return sendtype(res, 404, { message: 'Not found' });
  }
  await accidentEdit.update(accident);
  sendtype(res, 200, {message: 'ok'});
};

export const createPerson = async (req: Request, res: ServerResponse) => {
  const { person }  = req.body;
  await People.create(person);
  sendtype(res, 200, {message: 'ok'});
};


export const personAccidents = async (req: Request, res: ServerResponse) => {
  const {accidents, person, role} = req.body.data;
  for (const accident of accidents){
    await Relation.findOrCreate({ where: { personId: person, accidentId: accident, role: role },
      defaults: {personId: person, accidentId: accident, role: role} });
  }
  sendtype(res, 200, {message: 'ok'});
    };



export const getProtocol = async (req: Request, res: ServerResponse) => {
  const { id } = req.params;
  const accident =  await Accident.findByPk(id);
  const relations = await Relation.findAll({where:{
      accidentId: id,
    }});

  const peopleRole = [];
  for (const relation of relations){
    const p = await People.findByPk(relation.personId);
    peopleRole.push({ person: p, role: relation.role });
  }

sendtype(res, 200,{  info: accident.info, solution: accident.solution,
  registerDate: accident.registerDate, people: peopleRole});






};
