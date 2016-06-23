from bs4 import BeautifulSoup
from urllib2 import urlopen
import sys
import json

BASE_URL = "http://www.zerozero.pt/"

def make_soup(url):
    html = urlopen(url).read()
    return BeautifulSoup(html, "lxml")

def get_search_results(search_string):
    url = BASE_URL + "search.php?search_string=" + search_string + "&op=all"
    soup = make_soup(url)
    search_table = soup.find("table", "zztable stats")
    search_tbody = search_table.find("tbody")
    search_rows = search_tbody.find_all("tr")

    results = []
    for index in range(len(search_rows)-1):
        td = search_rows[index].find_all("td")[1]
        anchor = td.find("a")
        team_id = get_team_id(anchor["href"])
        if team_id != -1: results.append({
            'team_name' : anchor.get_text(),
            'team_id' : team_id
        })

    return results

def get_team_id(href):
    team_id = -1
    id_exists = href.find('equipa.php?id=')
    if id_exists != -1:
        start_pos = id_exists + len('equipa.php?id=')
        end_pos = href.find('&')
        team_id = href[start_pos:end_pos]

    return team_id

if __name__ == '__main__':

    #test = [
    #    {'team_name': 'Porto', 'team_id': 1},
    #    {'team_name': 'Benfica', 'team_id': 2},
    #    {'team_name': 'Sporting', 'team_id': 3}
    #]

    team_name = raw_input('')
    #fo = open('myfile.dat', 'a')
    #fo.write(team_name)
    #print json.dumps(team_name)
    #lines = sys.stdin.readlines()
    #team_name = str(json.loads(lines[0]))
    print json.dumps(get_search_results(team_name))
    sys.stdout.flush()