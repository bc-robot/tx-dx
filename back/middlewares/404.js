/**
 * Created by kevin on 16/11/17.
 */

function pageNotFound() {
    return function *pageNotFound(next){
        yield next;

        if (404 != this.status) return this.body = 'ppppppp';

        // we need to explicitly set 404 here
        // so that koa doesn't assign 200 on body=
        this.status = 404;

        switch (this.accepts('html', 'json')) {
            case 'html':
                this.type = 'html';
                this.body = '<p>Page Not Found</p>';
                break;
            case 'json':
                this.body = {
                    message: 'Page Not Found'
                };
                break;
            default:
                this.type = 'text';
                this.body = 'Page Not Found';
        }
    }
}

module.exports = pageNotFound;