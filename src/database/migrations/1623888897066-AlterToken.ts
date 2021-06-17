import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterToken1623888897066 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.addColumn('Token', new TableColumn({
            name: 'idUser',
            type: 'int',
            unsigned: true,
        }));

        await queryRunner.createForeignKey("Token", new TableForeignKey({
            columnNames: ["idUser"],
            referencedColumnNames: ["id"],
            referencedTableName: "User",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable("Token");
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("idUser") !== -1);
        await queryRunner.dropForeignKey(table, foreignKey);
        await queryRunner.dropColumn(table, "idUser");
    }

}
