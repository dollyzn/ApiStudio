# ApiStudio

This repository was made based on the code of the WhatsApp CRM multi user system [Whaticket](http://github.com/dollyzn/whaticket-cero), being able to use the available releases or edit the code and customize it as to prefer.

If you have any suggestions for improvement, feel free to create a pull request!

---

## Basic production deployment

### Using Windows

Just need to install XAMPP and assume you are using php8 or greater.

```bash
git clone https://github.com/dollyzn/apistudio C:\xampp\htdocs\apistudio
```

In `includes\connection.php` change the host, user, pass and database name to your respective Whaticket credentials and open the repository directory in the browser using apache `localhost/apistudio`
