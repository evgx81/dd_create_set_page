<script>
    import { total_amount_of_products, total_price } from "./stores";
</script>

<div class="catalog-price-total catalog-price-total--height">
    Total <span class="bold">
        <span data-name="item-count">
            {$total_amount_of_products}
        </span> items</span
    >
    for :
    <span class="bold size" data-name="total-price">${$total_price}</span>
</div>
