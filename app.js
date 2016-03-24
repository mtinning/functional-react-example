/// Data

const authors = [
  {
    "name": "bob",
    "email": "bob@bob.com"
  },
  {
    "name": "jeff",
  },
  {
    "name": "alice",
    "location": "Bristol, UK"
  },
  {
    "location": "London, UK"
  }
]

const comments = [
  "Functional programming is awesome!",
  "This is way better than OO",
  "I'm never going back",
  "Death to var, let and this!",
  "Everyone can write functional programs!"
]

/// Styles

const appStyle = {
  fontFamily: 'Helvetica',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const postStyle = {
  margin: '15px',
  background: 'white',
  borderRadius: '5px',
  padding: '10px',
  width: '500px',
  display: 'flex',
  flexDirection: 'row'
}

const authorStyle = {
  width: "30%"
}

const commentStyle = {
  width: "70%"
}

const nameStyle = {
  fontSize: '20px'
}

const emailStyle = {
  fontSize: '12px',
  color: 'blue'
}

const locationStyle = {
  fontSize: '14px'
}

/// Components

const name = a => <div style={nameStyle}>{a.name}</div>

const anonymous = () => <div style={nameStyle}>anon</div>

const email = a => <div style={emailStyle}>Email: {a.email}</div>

const location = a => <div style={locationStyle}>Location: {a.location}</div>

const empty = () => null

// Object -> []

const authorComponents = a => 
  R.filter(
    R.compose(R.not, R.isNil),
    [
      a.name ? name : anonymous,
      a.email ? email : empty,
      a.location ? location : empty
    ].map(f => f(a))
  )

const Author = (props) => (
  <div style={authorStyle}>
    {authorComponents(props.author)}
  </div>
)
 
const Comment = (props) => ( 
  <div style={commentStyle}>
    {props.comment}
  </div>
)

const Post = (props) => (
  <div style={postStyle}>
    <Author author={props.author} />
    <Comment comment={props.comment} />
  </div>
)

const post = p => <Post author={p.author} comment={p.comment} />

const adminUser = { "name": "admin" }

const App = (props) => (
  <div style={appStyle}>
    <h2>Functional Awesome!</h2>
    <Post author={adminUser} comment="What do you think of functional programming?" />
    {props.children.map(post)}
  </div>
)

const app = authors => <App>{authors}</App>

const nthWrapped = array => R.pipe(R.flip(R.mathMod)(array.length), R.flip(R.nth)(array))

const nthPost = i => R.merge({ author: nthWrapped(authors)(i) }, { comment: nthWrapped(comments)(i)})
  
const observable = Rx.Observable.timer(0, 1000)
  .map(nthPost)
  .scan(R.flip(R.append), [])
  .map(app)
  .subscribe(R.flip(ReactDOM.render)(document.getElementById('app')))
  