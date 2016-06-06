from bs4 import BeautifulSoup
from urllib2 import urlopen
from time import sleep

BASE_URL = "http://www.zerozero.pt/"

def make_soup(url):
    html = urlopen(url).read()
    return BeautifulSoup(html, "lxml")

def get_search_results(search_string):
    url = BASE_URL + "search.php?search_string=" + search_string + "&op=all"
    soup = make_soup(url)
    table = soup.find("table", "zztable stats")
    tbody = table.find("tbody")

    results = []
    rows = tbody.find_all("tr")

    for index in range(len(rows)-1):
        td = rows[index].find_all("td")[1]
        anchor = td.find("a")
        team_id = get_team_id(anchor["href"])
        if team_id != -1: results.append([anchor.get_text(), team_id])

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
    search_results = get_search_results("porto")
    print search_results
