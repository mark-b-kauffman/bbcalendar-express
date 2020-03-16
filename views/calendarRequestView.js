// used to render the data and from we use to submit json for a new calendar item.
  function render(token, user, calendars) {
    return (`
        <div className="row">
          <div className="large-6 column">
            <h2>Input JSON for a new Calendar item.</h2>
          </div>
        </div>

        <div>
          <form action="/newCalendarRequest" method="post">
            <table>
              <tbody>
                <tr>
                  <td>
                    - Enter JSON
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
