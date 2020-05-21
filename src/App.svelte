<script>
  export let name;
</script>

<div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
  <header class="masthead mb-auto">
    <div class="inner">
      <div class="masthead-brand">
        <h3>T.R.D.C.</h3>
      </div>
      <nav class="nav nav-masthead justify-content-center">
        <a class="nav-link active" href="/">Home</a>
        <a href="https://github.com/tedrand" target="_blank" class="nav-link">
          <i class="fab fa-github" />
        </a>
        <li class="nav-item fa-icon">
          <a
            href="https://www.linkedin.com/in/tedrand/"
            target="_blank"
            class="nav-link">
            <i class="fab fa-linkedin-in" />
          </a>
        </li>
      </nav>
    </div>
  </header>

  <main role="main" class="inner cover">
    <div class="container text-center">
      <img class="thumbnail" src="/public/cover-image.jpg" alt="" />
      <h1>🦕 {name}</h1>
      <p>
        Now running on Deno and Svelte. Check out the code
        <a class="body-link" href="https://github.com/tedrand/tr-deno">here</a>.
      </p>
      <a
        href="public/Theodore_Rand_Resume.pdf"
        class="btn btn-lg btn-dark" target="_blank"
        style="background-color: #2abe96;">
        Download Resume
      </a>
    </div>
  </main>

  <footer class="mastfoot mt-auto">
    <div class="inner">
      <p>Copyright 2020 Ted Rand, all rights reserved.</p>
    </div>
  </footer>

</div>


<style>
  .cover-container {
    max-width: 42em;
  }

  .thumbnail {
      width: 150px;
      border-radius: 75px;
      filter: grayscale(100%);
    }

  /*
 * Header
 */
  .masthead {
    margin-bottom: 2rem;
  }

  .masthead-brand {
    margin-bottom: 0;
  }

  .nav-masthead .nav-link {
    padding: 0.25rem 0;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    background-color: transparent;
    border-bottom: 0.25rem solid transparent;
  }

  .nav-masthead .nav-link:hover,
  .nav-masthead .nav-link:focus {
    border-bottom-color: rgba(255, 255, 255, 0.25);
  }

  .nav-masthead .nav-link + .nav-link {
    margin-left: 1rem;
  }

  .nav-masthead .active {
    color: #fff;
    border-bottom-color: #fff;
  }

  .nav-link {
    margin-left: .5em;
  }

  @media (min-width: 48em) {
    .masthead-brand {
      float: left;
    }
    .nav-masthead {
      float: right;
    }
  }

  /*
 * Cover
 */
  .cover {
    padding: 0 1.5rem;
  }
  .cover .btn-lg {
    padding: 0.75rem 1.25rem;
    font-weight: 700;
  }

  /*
 * Footer
 */
  .mastfoot {
    color: rgba(255, 255, 255, 0.5);
  }
</style>
