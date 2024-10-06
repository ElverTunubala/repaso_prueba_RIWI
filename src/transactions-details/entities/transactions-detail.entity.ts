import { Product } from "src/products/entities/product.entity";
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class TransactionsDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    transaction_id: string;
    
    @Column()
    quantity: number;

    @Column()
    unitPrice: number;

    @Column()
    subtotal: number;

    @ManyToOne(() => Product, (product) => product.transactionDetails)
    @JoinColumn({ name: 'product_id' })// Indica que `product_id` es la clave foránea
    product: Product;
}
