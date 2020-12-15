let o = [ 
    { 
        id: 'PO1CL08', 
        value: 'KAH-Serv1' 
    },
    { 
        id: 'PD7Q4UK', 
        value: 'Serv-2' 
    } 
]

//console.log(o)
//return options.filter(option => option.value.includes(query));
const a = o.filter(val => val.value.includes("Serv-2"))
console.log(a[0].id)
