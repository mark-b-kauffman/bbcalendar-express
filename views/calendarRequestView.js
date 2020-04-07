// used to render the data and from we use to submit json for a new calendar item.
  function render(token, user, calendars) {
    return (`
        <div className="row">
          <div className="large-6 column">
            <h2>Input JSON for a new Calendar item.</h2>
          </div>
        </div>

        <div>
          <form action="/new-calendar" method="post">
            <table>
              <tbody>
                <tr>
                  <td>
                    Enter JSON. If you don't use this the code will blow up. <br />
                    Make certain to use double quotes or the JSON parser won't work <br />
                    Be sure to use an existing calendarId. calendarId is the course_id/PK1. <br />
                    Make certain your start time is prior to your end time. <br />
                    Format: <br />
                    {"calendarId": "_4_1",
                    "title": "first new item from REST",
                    "start": "2020-03-19T19:00:00.000Z",
                    "end": "2020-04-19T19:00:00.000Z"}
                    <br />
                    <textarea rows="4" cols="50" name="custom_content" ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="Submit" />
          </form>
        </div>
        
        <div className="row">
          <div className="large-6 column">
            <h4>user: ${JSON.stringify(user)}</h4>
            <hr>calendars: ${JSON.stringify(calendars)}</hr>
          </div>
        </div>

      </div>`
    );
  }
  module.exports = {
    render,
  }
