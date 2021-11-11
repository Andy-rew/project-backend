import sequelize from '../src/sequelize';
import { People } from '../src/models/People';
import { Accident } from '../src/models/Accident';
import { Relation, Role } from '../src/models/Relation';

(async () => {
  sequelize.sync().then(async () => {
   const p1 = await People.create({
      name: 'Иванов',
      surname: 'Иван',
      midname: 'Иванович',
      address: 'ул. Пушкина дом 4 кв.2',
      convictNum: 1
    });

    const p2 = await People.create({
      name: 'Петр',
      surname: 'Петров',
      midname: 'Петрович',
      address: 'ул. Ленина дом 6 кв.43',
      convictNum: 2
    });

    const p3 = await People.create({
      name: 'Сидор',
      surname: 'Сидоров',
      midname: 'Сидорович',
      address: 'ул. Медиков дом 2 кв.676',
      convictNum: 3
    });

    const p4 = await People.create({
      name: 'Роман',
      surname: 'Романов',
      midname: 'Романович',
      address: 'ул. Романова дом 23 кв.376',
      convictNum: 2
    });

  const a1 = await Accident.create({
    info:'получение взятки в особо крупном размере',
    solution:'удовлетворено ходатайство о возбуждении уголовного дела',
    registerDate:'2015-05-10T16:50:19.000Z'
  });

  const a2 = await Accident.create({
    info:'оскорбление чувств верующих',
    solution:'отказано в возбуждении дел',
    registerDate:'2017-04-14T16:50:19.000Z'
  });

 const a3 = await Accident.create({
    info:'разбой',
    solution:'отправлено по территориальному признаку',
    registerDate:'2018-02-13T16:50:19.000Z'
  });

const a4 = await Accident.create({
    info:'разглашение гос. тайны',
    solution:'удовлетворено ходатайство о возбуждении уголовного дела',
    registerDate:'2019-08-12T16:50:19.000Z'
  });


await Relation.create({
  personId: p1.id,
  accidentId: a1.accidentId,
  role: Role.suspect
});

await Relation.create({
  personId: p2.id,
  accidentId: a2.accidentId,
  role: Role.victim
});

await Relation.create({
  personId: p3.id,
  accidentId: a3.accidentId,
  role: Role.culprit
});

await Relation.create({
  personId: p4.id,
  accidentId: a4.accidentId,
  role: Role.witness
});

  });
})();
