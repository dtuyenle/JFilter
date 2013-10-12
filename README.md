JFilter
=======

This is a javacsript plugin used to filter an array containning objects with different filters ( support different data structure and sorting ASC or DESC )

/*

array containing objects
res = [object,object,object,object]

data structure of object
object = {
	availability	: string,
	brand			    : string,
	description 	: string,
	displayReviews: boolean,
	overallRating	: float,
	popularRank		: integer,
	price			    : float,
	retailer 		  : null,
	subCategory		: array [string,string,string]
	tvSizeMax 		: integer,
	tvSizeMin		  : integer
}

Uasage:

var filter = new JFilter(res);

filterObject data structure is quite exactly the same as data structure of theo object that will be filtered.

The name must be the same except the name of the double range. For double range in this example it is tvSize, as you can see in the objects that will be filtered it is tvSizeMin and tvSizeMax, but in the filter object make sure remove Min and Max as the example below.

In some cases sometimes the return string is null, make sure put null as an element in the filter array

var filterObject = {
           	availability	: string,
			brand			    : string,
			description 	: string,
			displayReviews: boolean,
			overallRating	: float,
			popularRank		: integer,
			price			    : float,
			retailer 		  : array [null,string,string],
			subCategory		: array [string,string,string]
			tvSize 			  : {min: float, max: float},
			price			    : {min: float, max: float}
        };


option Object takes 4 config properties:

var option = {
	startId: ,
    limit: ,
    rankName: ,
    rankValue: 
}

Notice: This option is executed after all of the objects are filtered and returned as resultArray.
resultArray = [object,object,object,object]
+ startId: the index of the start element want to grab (integer)
+ limit: number of elements want to grab (integer)
+ rankName: the name of the object property that want to sort (string)
+ rankValue: indicate sorting ascending or descending (ASC or DESC)

var option = {
	startId: 0,
    limit: 20,
    rankName: 'pice',
    rankValue: 'ASC'
}


*/
