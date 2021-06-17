import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreateToken1623886220300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'Token',
                columns: [{
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                }, {
                    name: 'idtoken',
                    type: 'varchar',
                    length: '255',
                    isNullable: false
                }, {
                    name: 'strToken',
                    type: 'varchar',
                    length: '255',
                    isNullable: false
                }, {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'now()'
                }],
                indices: [
                    new TableIndex({ name: 'idxIdToken', columnNames: [ 'idtoken' ] }),
                    new TableIndex({ name: 'idxCreatedAt', columnNames: [ 'created_at' ] }),
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropTable('Token');
    }

}
