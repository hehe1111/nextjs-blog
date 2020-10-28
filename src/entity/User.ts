import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn("text")
    id: number;

    @Column("text")
    firstName: string;

    @Column("text")
    lastName: string;

    @Column("int")
    age: number;

}
