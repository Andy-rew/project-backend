import { Request } from 'polka';
import { literal, Op, OrderItem, WhereOptions } from 'sequelize';
import sequelize from '../sequelize';
import _ from 'lodash';

export function getPagination(
  req: Request
): {
  limit: number | null;
  offset: number | null;
} {
  const limit = req.query.limit !== 'no' ? Number(req.query.limit) || 20 : null;
  const offset =
    req.query.limit !== 'no' ? Number(req.query.offset) || 0 : null;
  return { limit, offset };
}

export function getOrderBy(req: Request, literals: string[] = []): OrderItem[] {
  if (req.query.sort) {
    const sort: { [key: string]: string } = JSON.parse(
      req.query.sort as string
    );
    return Object.entries(sort).map(([key, value]) => {
      if (!literals.includes(key)) {
        return [...key.split('.'), value === 'desc' ? 'DESC' : 'ASC'];
      } else {
        return [
          literal(`"${sequelize.escape(key)}"`),
          value === 'desc' ? 'DESC' : 'ASC',
        ];
      }
    }) as OrderItem[];
  }
  return [];
}

function getOneWhere(filterModel: any): WhereOptions | any {
  if (_.isNil(filterModel)) {
    return {};
  }
  if (filterModel.operator === 'AND') {
    return {
      [Op.and]: [
        getOneWhere(filterModel.condition1),
        getOneWhere(filterModel.condition2),
      ],
    };
  } else if (filterModel.operator === 'OR') {
    return {
      [Op.or]: [
        getOneWhere(filterModel.condition1),
        getOneWhere(filterModel.condition2),
      ],
    };
  } else if (
    filterModel.filterType === 'text' ||
    filterModel.filterType === 'number'
  ) {
    switch (filterModel.type) {
      case 'contains':
        return { [Op.iLike]: `%${filterModel.filter}%` };
      case 'notContains':
        return { [Op.notILike]: `%${filterModel.filter}%` };
      case 'equals':
        return { [Op.eq]: filterModel.filter };
      case 'notEqual':
        return { [Op.ne]: filterModel.filter };
      case 'startsWith':
        return { [Op.iLike]: `${filterModel.filter}%` };
      case 'endsWith':
        return { [Op.iLike]: `%${filterModel.filter}` };
      case 'greaterThan':
        return { [Op.gt]: filterModel.filter };
      case 'lessThan':
        return { [Op.lt]: filterModel.filter };
      case 'greaterThanOrEqual':
        return { [Op.gte]: filterModel.filter };
      case 'lessThanOrEqual':
        return { [Op.lte]: filterModel.filter };
      case 'inRange':
        return { [Op.between]: [filterModel.filter, filterModel.filterTo] };
    }
  } else if (filterModel.filterType === 'date') {
    switch (filterModel.type) {
      case 'equals':
        return { [Op.eq]: filterModel.dateFrom };
      case 'greaterThan':
        return { [Op.gte]: filterModel.dateFrom };
      case 'lessThan':
        return { [Op.lte]: filterModel.dateFrom };
      case 'notEqual':
        return { [Op.ne]: filterModel.dateFrom };
      case 'inRange':
        return { [Op.between]: [filterModel.dateFrom, filterModel.dateTo] };
    }
  } else if (filterModel.filterType === 'notnull') {
    switch (filterModel.type) {
      case true:
        return { [Op.not]: null };
      case false:
        return { [Op.is]: null };
    }
  } else if (filterModel.filterType === 'array') {
    return {
      [Op.and]: filterModel.array.map((a: string) => ({ [Op.contains]: [a] })),
    };
  } else if (filterModel.filterType === 'enum' || filterModel.type === 'enum') {
    return { [Op.in]: filterModel.filter };
  }
  return filterModel;
}

export function getWhere(req: Request): { [key: string]: WhereOptions | any } {
  if (req.query.filter) {
    const filter = JSON.parse(req.query.filter as string);
    const res: { [key: string]: WhereOptions } = {};
    for (const [key, filterParams] of Object.entries(filter)) {
      if (!_.isNil(filterParams)) {
        res[key] = getOneWhere(filterParams);
      }
    }
    return res;
  } else {
    return {};
  }
}

export function unpack(
  where: { [key: string]: WhereOptions | any },
  attributes: string[]
): WhereOptions {
  const result: WhereOptions = {};
  for (const key of attributes) {
    if (!_.isNil(where[key])) {
      const path = key.split('.');
      result[path[path.length - 1]] = where[key];
    }
  }
  return result;
}

export function toArray(arg: any | any[]): any[] | undefined {
  if (_.isArray(arg)) {
    return arg;
  } else if (!_.isNil(arg)) {
    if (_.isString(arg) && /^\[.*\]$/.test(arg)) {
      return JSON.parse(arg);
    }
    return [arg];
  }
}
