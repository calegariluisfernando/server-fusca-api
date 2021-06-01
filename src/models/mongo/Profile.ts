import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Profile {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;

    @Column()
    lastName: string;
}