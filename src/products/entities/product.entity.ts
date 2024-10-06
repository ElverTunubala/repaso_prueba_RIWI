import { TransactionsDetail } from "src/transactions-details/entities/transactions-detail.entity";
import { Column, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column()
    category: string;

    @UpdateDateColumn() //sirve para que se actualice automáticamente con la fecha y hora actual.
    updateAt: Date;

    @Column()
    status: boolean;

    @OneToMany(() => TransactionsDetail, (transactionDetail) => transactionDetail.product)
    transactionDetails: TransactionsDetail[];
}
