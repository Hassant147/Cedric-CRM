'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      return queryInterface.addColumn('raw_recipes', 'foodpreference', {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
              isIn: [['vegan', 'vegetarian', 'pescatarian', 'regular']]
          }
      });
  },
  down: async (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('raw_recipes', 'foodpreference');
  }
};
