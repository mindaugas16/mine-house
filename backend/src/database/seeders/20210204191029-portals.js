'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'portals',
      [
        {
          id: 1,
          title: 'Domoplius',
          name: 'domoplius',
          link: 'https://domoplius.lt/',
          imagePath: 'images/domoplius.svg',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Aruodas',
          name: 'aruodas',
          link: 'https://aruodas.lt/',
          imagePath: 'images/aruodas.svg',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          title: 'Kampas',
          name: 'kampas',
          link: 'https://kampas.lt/',
          imagePath: 'images/kampas.svg',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          title: 'Alio',
          name: 'alio',
          link: 'https://alio.lt/',
          imagePath: 'images/alio.svg',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('portals', null, {});
  },
};
