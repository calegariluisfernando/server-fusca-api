import {BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import { Helpers } from "../../utils/Helpers";


@Entity({ name: 'User' })
export class User {

    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column()
    public name: string;

    @Column()
    public email: string;

    @Column()
    public password: string;

    @Column()
    public isActive: boolean;

    @CreateDateColumn()
    public created_at: Date;

    /**
     * @param id {number}
     * @param name {string}
     * @param email {string}
     * @param password {string}
     * @param isActive {boolean}
     * @param created_at {Date}
     */
    constructor(id: number, name: string, email: string, password: string, isActive: boolean, created_at: Date) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.isActive = isActive;
        this.created_at = created_at;
    }

    @BeforeInsert()
    hashPassword() {

        this.password = Helpers.generateMd5(this.password);
    }
}
