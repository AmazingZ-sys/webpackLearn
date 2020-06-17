<template>
    <div id="containers">
        <h1>{{message}}</h1>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                message:"Vue开发环境"
            }
        }
    }
</script>
<style scoped>
    #containers{
        color: red;
        border: 5px solid #000;
    }
</style>