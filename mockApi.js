"use strict";

var mockApi = {};

var products = [{
		id: 1,
		name: "Sports",
		url: "https://www.amazon.com/soccer-store-soccer-shop/b/ref=sd_allcat_sa_sp_team?ie=UTF8&node=706809011",
		products: [{
			id: 1,
			name: "Basketball",
			image_url: "http://i618.photobucket.com/albums/tt264/martenfisher/basketball.png",
			price: 10,
			url: "http://www.amazon.com/Spalding-NBA-Street-Basketball-Official/dp/B0009VELG4?ie=UTF8&keywords=Basketball&qid=1463918146&ref_=sr_1_1&sr=8-1"
		}],
		image_url: "http://www.lf.k12.de.us/wp-content/uploads/2015/03/Sports.png"
	},
	{
		id: 2,
		name: "Toys",
		url: "https://www.amazon.com/toys/b/ref=nav_shopall_tg?ie=UTF8&node=165793011",
		products: [{
			id: 2,
			name: "Teddy",
			image_url: "http://www.mariahastingspersonalstylist.com/wp-content/uploads/2013/03/teddy.jpg",
			price: 35,
			url: "http://www.amazon.com/Gund-Slumbers-Teddy-Stuffed-Animal/dp/B007KALG8I/ref=sr_1_6?s=toys-and-games&ie=UTF8&qid=1463918166&sr=1-6&keywords=Teddy+bear"
		},
		{
			id: 3,
			name: "Helicopter",
			image_url: "http://www.babysavers.com/wp-content/uploads/2012/11/Syma-Blue-Toy-Helicopter.png",
			price: 120,
			url: "http://www.amazon.com/Syma-S107G-Channel-Helicopter-Gyro/dp/B00F4WMAI4/ref=sr_1_1?s=toys-and-games&ie=UTF8&qid=1463918182&sr=1-1&keywords=toy+Helicopter"
		}],
		image_url: "https://www.bluum.com/skin/frontend/bluum/default/gfx/home/products/toys.png"
	},
	{
		id: 3,
		name: "Clothing",
		url: "https://www.amazon.com/s/ref=sd_allcat_sft_men?ie=UTF8&bbn=10445813011&rh=i%3Afashion-brands%2Cn%3A7141123011%2Cn%3A10445813011%2Cn%3A7147441011",
		products: [{
			id: 4,
			name: "T-Shirt",
			image_url: "http://pngimg.com/upload/tshirt_PNG5448.png",
			price: 10,
			url: "http://www.amazon.com/Russell-Athletic-Basic-T-Shirt-X-Large/dp/B00076ZRBO/ref=sr_1_4?ie=UTF8&qid=1463918218&sr=8-4&keywords=T-Shirt"
		},
		{
			id: 5,
			name: "Scarf",
			image_url: "https://cdn.shopify.com/s/files/1/1038/2082/products/CASSA_SCARF_STONE.png",
			price: 33,
			url: "http://www.amazon.com/Love-Lakeside-Womens-Impressionist-Watercolor-Crinkle/dp/B00X48M42M/ref=sr_1_2?s=apparel&ie=UTF8&qid=1463918233&sr=1-2&nodeID=7141123011&keywords=Scarf"
		},
		{
			id: 6,
			name: "Pants",
			image_url: "http://www.jeans.ch/out/pictures/generated/product/1/310_412_75/sol_brax-pants-men-straight-fit-blue-everest-82-1858-23_f_1.png",
			price: 22,
			url: "http://www.amazon.com/Dickies-Mens-Original-Black-32x32/dp/B000N8PZAO/ref=sr_1_2?s=apparel&ie=UTF8&qid=1463918253&sr=1-2&nodeID=7141123011&keywords=Pants"
		}],
		image_url: "http://2.bp.blogspot.com/-mjMyuwW1wHY/VfG3XAtJAaI/AAAAAAAAEUQ/xof5dIFu00U/s1600/eco-green-organic-clothing.png"
}];

mockApi.getProducts = function(callback) {
	if(typeof callback !== "function") return;
	callback(products);
}

module.exports = mockApi;
