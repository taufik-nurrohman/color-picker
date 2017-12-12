Vue.component('color-picker', {
    props:['startcolor'],
    data(){
        return {
            color: this.startcolor ? this.startcolor : "#fffff",
            picker: null
        }
    },
    methods:{
        release: function(){
            this.$emit('colchange',this.color)
        }
    },
    template:`
    <input v-model="color"></input>
    `,
    mounted: function () {
        this.picker = new CP(this.$el)
        this.picker.set(this.color)
        var vm = this
        this.picker.on("change", function(color) {
            vm.color = '#' + color
        });
        this.picker.on("exit", this.release)
    }
})