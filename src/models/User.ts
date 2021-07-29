import {AfterLoad, BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Helpers } from "../utils/Helpers";
import { Token } from "./Token";

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

    @OneToMany(() => Token, token => token.user)
    public tokens: Token[]

    constructor() {
    }

    @BeforeInsert()
    hashPassword() {

        this.password = Helpers.generateMd5(this.password);
    }
}
