'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('priceChanges', 'diffPercentage', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn('priceChanges', 'diffPercentage')]);
  },
};
