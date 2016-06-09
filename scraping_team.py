from bs4 import BeautifulSoup
from urllib2 import urlopen
import sys
import json

BASE_URL = "http://www.zerozero.pt/"

def make_soup(url):
    html = urlopen(url).read()
    return BeautifulSoup(html, "lxml")

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

    lines = sys.stdin.readlines()
    team_id = str(json.loads(lines[0]))
    print json.dumps(get_team_games(team_id))
