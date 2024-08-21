import https from 'https';


function getIssueStatus(issueKey, jiracreds) {
  const orgName = 'hbuco'; // Replace with your actual organization name
  const basicAuthCreds = Buffer.from(jiracreds).toString('base64'); // Replace with actual username and password

  const options = {
    hostname: `${orgName}.atlassian.net`,
    port: 443,
    path: `/rest/api/3/issue/${issueKey}?fields=status`,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuthCreds}`,
    },
  };

  const request = https.request(options, (response) => {

    response.on('data', (d) => {
      let jiraTicketStatus = JSON.parse(d)?.fields?.status?.name;
      console.log(`Status of ${issueKey} is ${jiraTicketStatus}`);
    });
  });

  request.on('error', (error) => {
    console.log(`statusCode: ${response.statusCode}`);
    console.error(error);
    throw "Problem calling Jira : " + error.message;
  });

  request.end();
}


function ArgParser(args){
  if(args.length < 3){
    console.log("Usage: node index.js <issueKey>");
    process.exit(1);
  }
  const issueKey = args[2];
  return issueKey;
}

function main(){
  try {

    const jiracreds = process.env.JIRACREDS;
    if(jiracreds === undefined){
      console.log("Please set the environment variable JIRACREDS with the <username>:<password> format, where password is the API token.");
      process.exit(1);
    }

    const issueKey = ArgParser(process.argv);
    getIssueStatus(issueKey, jiracreds);

  }catch(e){
    console.log(e);
  }
}
main();
