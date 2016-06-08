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

def get_team_games(team_id):
    url = BASE_URL + "team_results.php?id=" + str(team_id)
    soup = make_soup(url)
    games_table = soup.find_all("div", {"id" : "team_games"})
    games_tbody = games_table[1].find("tbody")
    games_rows = games_tbody.find_all("tr")

    games = []
    for index in range(len(games_rows)-1):

        if len(games_rows[index].contents[4].contents) != 1:
            game_opo = games_rows[index].contents[4].contents[1].get_text()
        else:
            game_opo = games_rows[index].contents[4].contents[0].get_text()

        games.append({
            'game_date' : games_rows[index].contents[1].get_text(),
            'game_time' : games_rows[index].contents[2].get_text(),
            'game_field' : games_rows[index].contents[3].get_text(),
            'game_opo' : game_opo,
            'game_result' : games_rows[index].contents[5].contents[0].get_text()
        })

    return games

if __name__ == '__main__':

    test = [
        {'team_name': 'Porto', 'team_id': 1},
        {'team_name': 'Benfica', 'team_id': 2},
        {'team_name': 'Sporting', 'team_id': 3}
    ]

    lines = sys.stdin.readlines()
    team_name = str(json.loads(lines[0]))
    print json.dumps(get_search_results(team_name))
