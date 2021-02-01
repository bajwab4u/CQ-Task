const fs = require('fs'); 
const path = require('path'); 
const pdf = require('pdf-parse');
var docxParser = require('docx-parser');
const csv = require('csv-parser');


fs.readdir(__dirname+'/Resumes', (err, files) => { 

if (err) 
	console.log(err); 
else {
    
    var results=[];
    var skills=[];    
    var skillsWithSpace=[];
    fs.createReadStream(__dirname+'/skills.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
        results.forEach(element => {
        skills.push(element['tagName']);
        //skillsWithSpace.push(element['tagName'].replace(/-/g, ' '));
        
    });
    //console.log(skills);
    var details=[];
    files.forEach(file => { 
        if (path.extname(file) == ".txt") 
        {   
            let person={
                "phone":[],
                "email":[],
                "skills":[]
            };
            let result=fs.readFileSync(__dirname+'/Resumes'+'/'+file,'utf8');
            noSpace=result.replace(/\s/g, '');
            let regex_phone = /[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-_\s\.0-9]{9,20}/g;
            let phone;
            while ((phone = regex_phone.exec(noSpace)) != null) {
                person.phone.push(phone[0]);
                
            }
            let regex_email = /\S+@\S+\.\S+[^.,\s]/gm;
            let email;
            while ((email = regex_email.exec(result)) != null) {
                person.email.push(email[0]);
            } 
            skills.forEach(element => {
                let n = result.toLowerCase().search(element.toLowerCase().trim());
                if(n !== -1){
                    person.skills.push(element.trim());
                }
            });
            //details.push(person); 
            console.log(person);  
        }

        if (path.extname(file) == ".pdf") 
        {   
            let person={
                "phone":[],
                "email":[],
                "skills":[]
            };
            let dataBuffer = fs.readFileSync(__dirname+'/Resumes'+'/'+file);
            pdf(dataBuffer).then(function(data) { 
            let regex_phone = /[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-_\s\.0-9]{9,20}/g;
            let result=data.text;
            let noSpace=result.replace(/\s/g, '');
            let phone;
            while ((phone = regex_phone.exec(noSpace)) != null) {
                person.phone.push(phone[0]);

            }
            var regex_email = /\S+@\S+\.\S+[^.,\s]/gm;
            let email;
            while ((email = regex_email.exec(data.text)) != null) {
                person.email.push(email[0]);
            }
            skills.forEach(element => {
                let n = result.toLowerCase().search(element.toLowerCase().trim());
                if(n !== -1){
                    person.skills.push(element.trim());
                }
            });
            console.log(person);
            
            }
            );  
            //details.push(person); 
            
        }
        if (path.extname(file) == ".docx") 
        {   
            let person={
                "phone":[],
                "email":[],
                "skills":[]
            };
            docxParser.parseDocx(__dirname+'/Resumes'+'/'+file, function(data){
            let regex_phone = /[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-_\s\.0-9]{9,20}/gm;
            noSpace=data.replace(/\s/g, '');
            let phone;
            while ((phone = regex_phone.exec(noSpace)) != null) {
                person.phone.push(phone[0]);
            }
            var regex_email = /\S+@\S+\.\S+[^.,\s]/gm;
            let email;
            while ((email = regex_email.exec(data)) != null) {
                person.email.push(email[0]);
            }
            skills.forEach(element => {
                let n = data.toLowerCase().search(element.toLowerCase().trim());
                if(n !== -1){
                 person.skills.push(element.trim());
                }
            });
            console.log(person);
            });  
            //details.push(person); 
            
        }        
        
    });
    //console.log(details);   
  }); 
	
 
} 

});




