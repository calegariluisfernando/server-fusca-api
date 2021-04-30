import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreateUsers1619402213166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'User',
                columns: [{
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                }, {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                    isNullable: false
                }, {
                    name: 'email',
                    type: 'varchar',
                    length: '255',
                    isNullable: false
                }, {
                    name: 'password',
                    type: 'char',
                    length: '32',
                    isNullable: false,
                }, {
                    name: 'isActive',
                    type: 'boolean',
                    isNullable: false,
                    default: true
                }, {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'now()'
                }],
                indices: [
                    new TableIndex({ name: 'idxChaveEmail', columnNames: [ 'email' ], isUnique: true }),
                    new TableIndex({ name: 'idxName', columnNames: [ 'name' ] }),
                    new TableIndex({ name: 'idxEmail', columnNames: [ 'email' ] }),
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropTable('User');
    }

}
