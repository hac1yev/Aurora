import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ type: 'date' }) // database handles it properly
    birthDate!: Date;

    @Column({ type: 'int' })
    height!: number;

    @Column({ unique: true })
    phoneNumber!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false }) // Hide password from responses. Password will NOT be returned in queries automatically
    password!: string;
}