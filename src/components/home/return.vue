<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
      <span class="text-base font-bold">逾期未还书籍:</span>
    </div>
    <div class="flex-grow overflow-hidden">
      <DataTable :value="products" tableStyle="min-width: 50rem" class="h-full" scrollable scrollHeight="flex">
        <Column field="name" header="Name"></Column>
        <Column header="Image">
          <template #body="slotProps">
            <img
              :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
              :alt="slotProps.data.image"
              class="w-24 rounded"
            />
          </template>
        </Column>
        <Column field="price" header="Price">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </Column>
        <Column field="category" header="Category"></Column>
        <Column field="rating" header="Reviews">
          <template #body="slotProps">
            <Rating :modelValue="slotProps.data.rating" readonly />
          </template>
        </Column>
        <Column header="Status">
          <template #body="slotProps">
            <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" />
          </template>
        </Column>
        <template #footer>
          <div>总共有 {{ products ? products.length : 0 }} 本书未还</div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Tag from 'primevue/tag';
  import Rating from 'primevue/rating';

  export default {
    components: {
      DataTable,
      Button,
      Column,
      Tag,
      Rating
    },
    data() {
      return {
        products: [
          {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
          },
          {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
          },
          {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
          },
          {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
          },
          {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
          },
          {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
          },
          {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
          },
          {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
          }
        ]
      };
    },
    methods: {
      formatCurrency(value) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      },
      getSeverity(product) {
        switch (product.inventoryStatus) {
          case 'INSTOCK':
            return 'success';
          case 'LOWSTOCK':
            return 'warning';
          case 'OUTOFSTOCK':
            return 'danger';
          default:
            return null;
        }
      }
    }
  };
</script>
