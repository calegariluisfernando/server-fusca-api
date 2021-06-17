import {getCustomRepository, MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";
import { UsersRepository } from "../../repositories/UsersRepository";

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

        const usersRepository = getCustomRepository(UsersRepository);
        const user = usersRepository.create({ name: 'Luis Fernando Calegari', email: 'calegari@lfc.com.br' , password: '123'});

        await usersRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable("User");
        await queryRunner.dropIndex(table, "idxEmail");
        await queryRunner.dropIndex(table, "idxName");
        await queryRunner.dropIndex(table, "idxChaveEmail");

        await queryRunner.dropTable(table);
    }

}
