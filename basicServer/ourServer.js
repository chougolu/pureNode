const http = require('http');

const server = http.createServer((req,res)=>{
    if (req.url == '/') {
    	res.write('Home page called !')
    }else if(req.url == '/about'){
    	res.write('About page called !')
    }else if(req.url == '/contact'){
    	res.write('Contact page called !')
    }else if(req.url == '/service'){
    	res.write('Service page called !')
    }else if(req.url == '/blog'){
    	res.write('Blog page called !')
    }
    res.end();
})

server.listen(4000, ()=>{
	console.log('oue server is running on 4000 port')
})