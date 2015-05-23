function mySearch(a, b)
{
	return b.search(a);
}

function getToken(prog)
{
	var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var digits = '0123456789';
	var prog = prog.trim();
	var p = -1;

	if(prog == "")	return ['', ''];

	if(letters.indexOf(prog[0] != -1)){
		p = mySearch(/[^a-zA-Z0-9]/, prog);
		if(p < 0)	return [prog, ""];
		else		return [prog.slice(0, p), prog.slice(p)];
	}
	else if(digits.indexOf(proc[0] != -1)){
		p = mySearch(/[^0-9]/, prog);
		if(p < 0)	return [prog, ""];
		else		return [prog.slice(0, p), prog.slice(p)];
	}
	else	return [prog[0], prog.slice(1)];
}

function getStat(prog, reg)
{
	var gettoken = getToken(prog);
	var token = gettoken[0];
	var rest = gettoken[1];

	if(!token) 	return ["", ""];
	if(token == "while"){
		var getexpr = getExpr(rest, reg);
		var code1 = getexpr[0];
		var rest = getexpr[1];

		var getstat = getStat(rest, reg+1);
		var code2 = getstat[0];
		var rest = getstat[1];

		var l1 = nextLabel;
		var l2 = nextLabel+1;
		nextLable += 2;

		var code = "z" + l1 + "\n" + code1 + "  jz  r" + reg + ",z" + l2 + "\n" + code2 + "  jmp  z" + l1 + "\nz" + l2 + "\n";

		return [code, rest];
	}
	else if(token == "{"){
		var code = "";
		while(1){
			var gettoken = getToken(rest);
			var tok = gettoken[0];
			var rest1 = gettoken[1];

			if(!tok)	return ["", ""];
			if(tok == '}')	return [code, rest1];

			var getstat = getStat(rest, reg);
			var code1 = getstat[0];
			var rest = getstat[1];
			code += code1;
		}
	}
	else{
		var gettoken = getToken(rest);
		var second = gettoken[0];
		var rest1 = gettoken[1];

		if(second == "="){
			var getexpr = getExpr(rest1, reg);
			var code = getexpr[0];
			rest = getexpr[1];

			vars[token] = 1;

			return [code + "  sto r" + reg + "," + token + "\n", rest];
		}
		else	return getExpr(prog, reg);
	}
}

function getExpr (prog, reg){
	var getterm = getTerm (prog, reg);
	var code1 = getterm[0];
	var rest = getterm[1];

	if(!code1)	return ["", ""];

	var gettoken = getToken(rest);
	var opcode = gettoken[0];
	var rest1 = gettoken[1];

    if(['+','*','-','/'].indexOf(opcode) != -1){
	var getexpr = getExpr (rest1, reg+1);
	var code2 = getexpr[0];
	var rest = getexpr[1];
	var code = '';
        if(opcode == '+' )
            code = '  add r' + reg + ',r' + (reg+1) + '\n';
        if(opcode == '-' )
            code = '  sub r' + reg + ',r' + (reg+1) + '\n';
        if(opcode == '*' )
            code = '  mul r' + reg + ',r' + (reg+1) + '\n';
        if(opcode == '/' )
            code = '  div r' + reg + ',r' + (reg+1) + '\n';
        return [code1+code2+code, rest];
	}
    else   return [code1, rest];
}

function getTerm (prog, reg){
	var gettoken = getToken(prog);
	var token = gettoken[0];
	var rest = gettoken[1];

	if(!token) return ["", ""];

    if(token == "(" ){
	var getexpr  = getExpr(rest, reg);
        var code = getexpr[0];
	var rest = getexpr[1];

        if(!code ) return ['',''];
	var gettoken = getToken(rest);
        var token = gettoken[0];
	var rest = gettoken[1];

        if( token != ")" ) return ['',''];
        else             return [code,rest];
	}
    else if(token < 'A' ) 
        return ['  ld# r' + reg + ',' + token + '\n', rest];
    else 
        return ['  ld  r' + reg + ',' + token + '\n', rest];
}

function main () {
//	var program = "term = 5\n ans  = 1\n while term { ans=ans*term  term=term-1 }\n ans";
	var program = 'a*3';  
  var rest = program;
    while(rest ){
	var getstat = getStat(rest, 0);
        var code = getstat[0];
	rest = getstat[1];

        console.log( 'code', code);
        console.log( 'rest', rest);
	}
    console.log( "hlt");
    for(var key in vars)
	if(vars.hasOwnProperty(key))
	        console.log( key,'0' );
}

var nextLabel = 1;
var vars = [];

main();
