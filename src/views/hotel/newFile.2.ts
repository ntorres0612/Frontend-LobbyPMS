export default (await import('vue')).defineComponent({
    data() {
        return {
            formFieldsCopy: {},
            valid: false,
            form: {
                name: '',
                address: '',
                country: '',
                province: '',
                city: '',
                nit: '',
                phone: ''
            },
            nameRules: [
                (value: any) => {
                    if (value) return true;

                    return 'Name is required.';
                },
                (value: any) => {
                    if (value?.length <= 10) return true;

                    return 'Name must be less than 10 characters.';
                }
            ]
        };
    },
    computed: {
        // displayProfile() {
        //   return `My name is ${this.name} and i am ${this.age}`
        // }
    },
    methods: {
        resetForm() {
            this.$data.form = { ...this.formFieldsCopy };
        }
    },
    mounted() { }
});
