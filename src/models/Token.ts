import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'Token' })
export class Token {

    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column()
    public idtoken: string;

    @Column()
    public strToken: string;

    @CreateDateColumn()
    public created_at: Date;

    @ManyToOne(() => User, user => user.tokens)
    @JoinColumn({ name: 'idUser' })
    user: User;

    constructor() {
    }
}