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
			url: "https://www.google.co.il/#q="
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
			url: "https://www.google.co.il/#q="
		},
		{
			id: 3,
			name: "Helicopter",
			image_url: "http://www.babysavers.com/wp-content/uploads/2012/11/Syma-Blue-Toy-Helicopter.png",
			price: 120,
			url: "https://www.google.co.il/#q="
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
			image_url: "https://upload.wikimedia.org/wikipedia/en/3/31/JoeyFox91_Men's_tshirt.png",
			price: 10,
			url: "https://www.google.co.il/#q="
		},
		{
			id: 5,
			name: "Scarf",
			image_url: "https://cdn.shopify.com/s/files/1/1038/2082/products/CASSA_SCARF_STONE.png",
			price: 33,
			url: "https://www.google.co.il/#q="
		},
		{
			id: 6,
			name: "Pants",
			image_url: "http://www.jeans.ch/out/pictures/generated/product/1/310_412_75/sol_brax-pants-men-straight-fit-blue-everest-82-1858-23_f_1.png",
			price: 22,
			url: "https://www.google.co.il/#q="
		}],
		image_url: "http://2.bp.blogspot.com/-mjMyuwW1wHY/VfG3XAtJAaI/AAAAAAAAEUQ/xof5dIFu00U/s1600/eco-green-organic-clothing.png"
}];

mockApi.getProducts = function(callback) {
	if(typeof callback !== "function") return;
	callback(products);
}

module.exports = mockApi;
