const places = [
  {
    id: 1,
    name: "Hunza Valley",
    description:
      "A picturesque valley known for its stunning landscapes, including snow-capped peaks and lush greenery. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "data:image/jpeg;base64,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",
    category: "Valley",
    region: "Gilgit-Baltistan",
    rating: 4.8,
    lat: 36.3167,
    lng: 74.65,
  },

  {
    id: 2,
    name: "Naran & Kaghan Valleys",
    description:
      "Famous for their serene lakes like Lake Saif-ul-Malook and lush green meadows. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhMWFhUXGBkbGBgYGBsYFxkZGhoYGR0YGBgYHSggGBolHRodITEhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGxAQGi8lHyYtLS0tKy0vLS0tLS0tLS0tLS0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMIBAwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQMGAAECBwj/xABAEAABAgQEBAMGBAUBCAMAAAABAhEAAyMhBBFBUQUiYXETgZEGMqGxwfBCUtHhFCNicvGCBxUWM0OSorJk0uL/xAAaAQADAQEBAQAAAAAAAAAAAAACAwQBAAUG/8QAMBEAAgICAgAEBQIFBQEAAAAAAAECEQMhEjEEMkFREyJhcYGRsRShwdHwM0JD4fEF/9oADAMBAAIRAxEAPwAWWWsWL0IoQRqOsejezHtambllTqTLBVkqv6H6mkeFcL40uVymqX1uBsOkWvBYhM1Lp8xtHoSisiPNi5Y2e5lEZkik+xftLkAw880tLWdNkH6Hyi9mIpxcHTLIOMlaI2jMsdvG4Gw1FEeUxjdI7IjkqI7R1hUcrRSAcRKbRoOXODUjYSFCojFJoxxTEyhtGJgybhWLekbXh6iGckL4MFKo4JjucGNLRGIJAtHaFmDJC2MAWiaXNgXsKI0CaGI17xylTpJjmWQS0Ahko2qOnjaGF4kyiOCp6NHNmRhRMgxpRjUuNTTWAGmyXgZck3ggGMMcjGRoFI0WSHUQBSpoHJYVPUtGYzFIlIVMmEJSkFR7C7DXt1EeTe2HtacUcksFEoAOCXza87Uv+HoCdgaVisk1Ee+1/tu7yMIroqaDcNZB015ulN4oSZpcN994ilK+/wBYkwockn7ftDKjVkOSTm9h8puvlEkxRy0HlT4xCFkJc20Ap59oGGI1+W3fSI3Nt6FUdzEn7L/KAZ6mJr9YknTh8fT4QJOUCWBt5+rfd418rthJEJlvVjG4hUqsZG2zaF0xBJFO/wAf0gnB4hUtQKS12P0PSNBNa2+77RMiXd6dPpHpJ0NYwwvGFj3uYbahy58o9G9jfbkMJc5RUgamqka11UmvlHlIRHUoqQoKSWIgpJTWzI/K7R9PIIIcFwRQ/WMIjy72E9tMiPDmVQNNUHp/QdtI9Pw2IStIUghQNiIjnBxeyyGRSR0BHEwxIUxEsPADASeGNLRPJrrA0wX+EZLWRSOZiCVJ3MdAhmiFbm0R+GRWBQTNzsKDaAZiSDUQ2TMBED4pLikbGe6MlDVi946QI00aENsUMsMsR0tBo0Lkr2vBIxDXLQt36DVJeoWmZprHKp3nASscHol+piRU96xiTO5Im8WJnBgNC3jvxkhyVABIJU5AYAAknYAEeojaM5IJSiFftHx+ThJZMxYCyDkS2ZRO+X8oNySBo8UzjH+07Kkpw0sFf51VSAwqE3Up92A6x5/j8YuYornKMxarlRv3t6BgLCNoVPKl0O/aX2onY01ZEpJdKRpo5Ubn0EJpUujuW+J/SIMpUPPT5QTNSUoarJoS2uzwTjqmyV2+zELqSfLpBWHASjMrWwJv+0ByAFM1ANYmmTSTQ9oj8RlVqMegGTTFPUg+kRFbsxPWwiFU56XiJS2qOW29fjGYlKvoaonM+tXYawLPXoILXPJs1Sz66dft4WzV1o3e/pBTbT7C40SoQGrWMjSSAKpEZCXk+p2iKTp3gqUPSA5NK9/swXKmHWPXs5msQlq/dYyWrNHM+Zb/ADV4jCun20GmcGSyUEKBYgxdPZT20VIYHmQS6keoJTsYpklYUOsRilRSsE6kqOTado+ksBj5c5AmSlhSTqPkRcHoYlWI+eOH8VmSyDLmLlqd3ScrnR9D5xe+Bf7R1hQRikggkDxE0KQSeZSQOYWs1jeJpYmuimOZPs...",
    category: "Valley",
    region: "Khyber Pakhtunkhwa",
    rating: 4.7,
    lat: 34.909,
    lng: 73.648,
  },

  {
    id: 3,
    name: "Fairy Meadows",
    description:
      "A high-altitude plateau offering breathtaking views of Nanga Parbat, the world's ninth-highest mountain. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to August",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQSEhUTExMWFhUXGBoZGBgYGB8dHRgYFxoYFxkYHx8fHSgiHR0lHxkbIjEhJSkrLi4uFyAzODMtNygtLisBCgoKDg0OGxAQGy0lHyUvLS0vLS0tLy0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAFBgMEAAECB//EAEEQAAIBAgQDBwIEBAMHBAMAAAECEQMhAAQSMQVBUQYTImFxgZEyoUKxwfAUUtHhI2JyFTOCkqKy8QdDRMIWJHP/xAAaAQADAQEBAQAAAAAAAAAAAAABAgMEAAUG/8QALxEAAgIBAwIFAwQBBQAAAAAAAAECEQMSITEEQRMiUWGRBTKhFHGB4bEVQmLR8P/aAAwDAQACEQMRAD8AD91jg0sDsvniF1ajIWIMkM0mPxWgR8364u5fiimA/hMxO4JP5flj6jH1kJOnseDPpZRVrc0y45g4JPR8sQtSxrUjK4lOTjZJxY7vGxSwbF3Kus4zWcWzSxo0cG0K1L1K4qHG9eJe5xho4OwtyIS5xvViXucaNE4OwtyITjYYjnjvuzjAmDsLqZ0mYbEqZvriEUzjsZYkTBgbmLYRqPcpGc+xbp50dcdHO+eB/c46FE4Tw4FPGmWzn2HPGf7SncYjo5F2+kEztyB5bn0PwcaqZFhupAteLXEi+22FrHdbD6slXRIc4DyjENR5xx3ONaDh1GPYXxJdzhqmMFY47040aeGpC6mbGYPMY33oO4xxox0FwGkMpszSuM7hTjRTHOk46htXsaqZLpfEH8KcWQxHPGd7g+YHlKpyjdMcHLnpi+Kx646GYOO1SDUfUFmkemJstkXqHwqT58h6nYYvir5DFtmYAIVYDeIwk8kkhowTYAegQY57YYOEdl+8XW7iOi+/l5Y7/wBjkUzWfwIIufPbA49rmpoKWWUBRMswkt PMCbe8+gxg6zrlGNRlubOn6VuVyWw9ZPMZfh1GWJ3JHNnPOB/4AwsZ3t3XdyaSqichoLn1JnfyjphQzGdqVWLOzO0Rc/YdB6YwZgDpj5zLllKVnrxSiqJc5SAiLC0SRYQDP3nFbL5pKkopgiZB3gGPvviTi7MKSmmZRgTIMGOYP2t1B6WVq1XS6sp2veCQZ9h+98aJ5/NSIxh6jvkM+9LwkF0+49P6H7YZMlw18wpeghdAJLAgARyMkQfI3wsUqi1FlTMi99jjeVzz5aXVyh2PRh0K7MPI49HH1OSEdvyZMnTwlINV6BRirAqw3HT99cQVnCKWYwB+/nBap2r79VTMqtPTARlHhJi8zcDnufaMLfbSoyEIApQhXsLkHaDPiG+3zbGiX1FQx215jL+icp0nsE6YkAjYiQfI47FPHHCMm4LPUYd05VabM8yzAFVFokgiwJJnaL4KnKp/OPnGjF1KyRsjlwOEqB4yxO0HEn8Cw5YJU+HErqB8O0xaek9cc5+hVpUu8uVnkpYEwW0EidJaIB5EjqATLqYx7gj07fYEiJKyJESOk7fljoUzgPwRDTzBZ4CMzBlqVVQoxGsEjdrEgaVINjbDWcsxzqUF/wB2ySG0wCzFQJN9JBMaTz9RjLD6nBxuW25eXQTTqIOFEnljS0Z5Y9DyPYlRepUb0UR/1EGfSMFstTy1AkIqNUWx0wWHqTfAn9TgvsVjQ+nyf3OhO4L2NZx3laadOLD8Te3IevxgzX4MlI0AhVFptrOsmCxiQerQJ5ARG1sM9LNnTqYQvyYsLAXMnC2maGdqtTMohHhgCSAb7zpkHpMA+WPOn1GXNJuT2Rvhgx4lUVuVeKcFoRqWkjAk/wCIXKlmmyqA0FvMwLE4k7OdnMu/jNJtSMQVqHwgiDtF9xvI3ww5fKaQEt3SgiDux2g2iJm/lirSyh...",
    category: "Meadow",
    region: "Gilgit-Baltistan",
    rating: 4.9,
    lat: 35.0267,
    lng: 74.5036,
  },

  {
    id: 4,
    name: "Neelum Valley",
    description:
      "Known as the 'Blue Gem' of Pakistan, famous for its waterfalls and lush forests. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSEhMWFRUXGBgYGBgYGBceGBgfFx0fGB4XGxkbHSggHR4mHRgbITEiJSkuLi4uHx8zODMtNyotLisBCgoKDg0OGxAQGy8mICUuKy0vMDAwMC0yLS0vLS0tLy0tNS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vLS0tLS0tLf/AABEIAKcBLQMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAAIDBAYBB//EAEAQAAIBAgQEBQMBBgQEBgMAAAECEQMhAAQSMQVBUWEGEyJxgTKRobEjQlLB0fAUYnLhFTOCkgcWQ1Oi0mNzsv/EABoBAAIDAQEAAAAAAAAAAAAAAAIDAAEEBQb/xAA2EQACAgEDAQQIBgEEAwAAAAABAgARAwQSITETQVGhFCJhcYGR0fAFMkKx4fHBI1Ki0jNTkv/aAAwDAQACEQMRAD8Av5eqlSShDQSDHYkfyOHGljyzhPG62XaUa3NT9J57fzGNDwjxkQVWrDAn6jYiTuesAn7DHot1TgvpW7przTwwrjuV4hSqEBGuVLAdg2mfviy1PB7pmZSOsp6ccK4tNTwxqeLDQKlfTjkYn04aVxdyqkUYUYl045GLuSpHGFGJIwoxLkkcYUYkjHIxdyoyMKMPjCjEuSNjCjDowoxVy6jYwow6MKMXckZGFGHxhRirkjYx0YUYq5I2MKMPjHIxVyVGY7GHRhRiXLjAMKMPjCjEuVI4wow/TjhGLuXGxhRh0YUYq5I2MLHcLEliNwow7CxcueZPkmE9lDfcx+uIvIZYJBAP6bYO+S2pxMjy9VrXHL7t8xh/EaICETGpoF5jSb/32xzxl5ozs1A/DM+9F/MQwYj4kNHtKjGw4T4wM0KDIohgj1GLEtrgKTe2km8bxjH1aAkKJm4M9d8W0RdJVoIXmLX2judzgn9kraD1E9eyXEMrVpKR5aO4MAuTBFoktBJI2HbriOpkjyjnMEEW5BrTy5DcY8lddMhRYC17ycSZLxDmKDSHJAvDEkdOeFY9wPWU+JG7p6a9IgwRfEZp4bluM5epTSrrWXBMuNJ9LBIaCeZHMjnyxItZfpLKWiYmCe6iW1SP4TjQuXxmLJpSOkj0Y4Uwd4Rw6hmBFPMDzAPUhWGHwSCR3FsTVPDD301EMcrj+RxXpWO6Jgeh5aupmtOFpwZzHAa6XKEjqpB/Av+MDnokGCCD0Ig4auRW6GKbEy/mErEY5pxY0Y55eC3QKkGnC04tZvLNTVWcFdYJE9BzxXRg2xnEDA8iWyEdRG6cIjEmnDdOCBlVGRhYfpwtOLkqMjHYxby2TLXMhesf3/YxFm1CVNAM2BExJtO04WMgLbRGHC+3dXEgjCjD8KMHF1GRhYfGORiSVG4WOkYWJclTmORh0YUYkkZGFGHnHIxLkjYwsOwsS5cbGOFcPjHYxLkkYXHdOH6cd0Yly5kaNFEcrNQB1mCBIIbULx0Ux2xTzgTSTcsahk+zSYG23PDcpnxqgka0II3VTphdME29I6RFr83cO+kOxECpp6wW37RB5Y5uMgjdO0wo1IahVatVhvpBUEczBJ/X74qKdSRpMCTItJ359pwTzeXUaTsDuxiYWw3tfSbYmbLBU0hraWHqsZaBFton9cM3CrgQYtYAKxUmbXG8i5Hz+uHV1SpqGodvib3+MFKlGKYO7AHTH+YkRbbcfbA3O61pqeZvpgWHXrJ3wIpjxCjNJMKDYSVHIA+owP73xNkeNlNVNgGUsSDsQeoPycUBmIEMDruL8pEdMNGWJVQBcsb/Asf1w5VrrBu5rOG+I0ZhqlQSL81bYMG3iYseX3xqMlx7QEJlYYyysfUGmTp+k/UTJHuRvjyKrTK2kESdsG+AceZB5VT1IY91gaRH6Yo4w3XmWDXSeo1fFFZtTpZZJAIViBYAAwDpJ6Hcb2uIz1dKyGq...",
    category: "Valley",
    region: "Azad Kashmir",
    rating: 4.6,
    lat: 34.0,
    lng: 73.8,
  },

  {
    id: 5,
    name: "Skardu",
    description:
      "Gateway to some of the world's highest peaks, known for lakes, mountains, and trekking. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "May to September",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMVFRUXGBcXGBgYFxcYGBgYFxUaFxgXFRgeHyggGBolHRcYIjEiJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGisdHR0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLf/AABEIAKkBKgMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAIFBgEAB//EAEMQAAECBAQDBAcGBAQGAwAAAAECEQADITEEEkFRBWFxEyKBkQYyobHB0fAUM0JScrJzs+HxIzRighU1U3SStAcWxP/EABkBAQEBAQEBAAAAAAAAAAAAAAEAAgMEBf/EACYRAQEAAgICAQMEAwAAAAAAAAABAhESIQMxQQQTUSJhcYEUMkL/2gAMAwEAAhEDEQA/ANYJJiQwp3iSZgiSp+wj0brjqBGUE3r9awMmDFJVAezMQeEdeO9iraPGSo6RJ4KibQsQRExMMSTUiCS5cck84YQBpBs6FlpgkEkJjqkvA0EBEVCDlDR0SxEic1EITkkGLSamE5yY1jWcoQKoNJRmiC0VhySQI3b0xIgcPAVy2hmZiBACt4Js3QCojmh6XI1MdVLDw8oOKuUmOGSdjFugiJTaC0HNcFEUR1MomLNUeSgbVh5jgSGDVyjpwZ3ixUAOsDMHOnhCcrDEGHc0QL7RHLBbsyaQnp1hNcWCxSFjKjeNZyhIpjmWHOyjnZRrbPErkj3Zw2JUSThzBcjxJZI52cWacHHvsUHM8BRLggIjy0ENzEQyGOToMgCJpREZSQA5NYOuYEgAbePjA05liK44CYhNECLzmeFymDqTHkIc0jTKWElu+8NypbGJdllAGsezaQGDBcTCoXBgku8BGzx0hxEuyAAtEshoHvAS0xMLTUPFmsBqkwBSBDKLFacKTWJJwkOTa+EcloOgh5UaKnBiB9g0WaZCjTKY9MwShpFyXFXJSY8EVrFkZWUWr0+qQlNSYtrSC1DT22gS1OY7MFIgE0hDuSOmkTkod2uA/lHhBshmsMSZTh26QGWKszmLCiU+FfrWK1SFZoLfVrCFzLN2h6SsEsaBq9BVyYDiMQkkgBhpz+UUqsKpTBRI5RCXP5QfFqCQljW/94d0ac+yiPIwo1g+GIUAX8NusSIGYJzBzo+0Z3WtQDsQbC0El4dtNHj3aCWHVrpqfCBzMfmDANF2kp6WD8zC3aQXP3RVyQfADQeRhLtooqr8HjiihqNvltFwnEBQdP8AbrFNPwpYrSCz0BIfw/NHsDiMp5Gh94Pu843Y5y6XchOpNPq0FJBNoXzaEwdKkjmYy26FQSbIypzK1sN+u0ClzsvePh/WBYvElR2GgcwEKD4eZl0ELZo8Fw6B+fPevhEJCCqOYOXmcmgGpt05nl0hxIAFGtrd/wCkBCKGv9coIJgbux2YHykG78gAGvAZMwOzij103eJHMMXYmw84anKGl4rkLFFKPwdj/fz5RL7USQ1/Zv8AXSAmZRrX+8HnSHFPL3QihZJzaDxtcAawyucS4AIcON2b57beMFTyMKkesbMTzO0NIRUd0h97QDDTEpLOVKvpS1S3hBpeNKlKBSO63UuVD4e2IjTVZQ/17IDJnZtHvXpAZveISLJv1bX2eUcUyE5UgqI6VPzi0DKlJS6jrc8uWwhHFSDNDOQp9LAaAiCB/wATZjWhegH1bWKnjOKXlJSooFgBa9SoilhzEMipLEFSJhlk5jyu3L60j0hQVmClMwJ8oVwCCuYkl3FDVtCUnzDH6MX2PwyVMhSQVHq4HIxtj2pcPiizgtT33g32jlHVcHmJ0caVAhVaFoPeBYlgWYDqbRDs9h5nefZzb3wOfjSqkAUsMz/1iE1QABqfdaLR2bTPZI5n3GIznzA1Yt5ROcBlQctnFfxFqnmAT9WHVz...",
    category: "Valley",
    region: "Gilgit-Baltistan",
    rating: 4.7,
    lat: 35.3353,
    lng: 75.536,
  },

  {
    id: 6,
    name: "Murree",
    description:
      "Popular hill station close to Islamabad, famous for pine forests and pleasant weather. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "March to June",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFRUWGBgaGBgYGR4fFhcYGBgbGxkXGBobISgiGxslHxoaITEhJSkrLi4uGB8zODMsNygtLisBCgoKDg0OGxAQGy0lICUtLS0tNS0tLS0tLy0tLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMcA/QMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAADBAIFAAEGBwj/xAA7EAABAgQEAwYFBAEEAQUAAAABAhEAAyExBBJBUQVhcQYigZGh8BMyscHRQlLh8RQHFSNicjNDU5LS/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDAAQF/8QAJxEAAgICAgMAAgICAwAAAAAAAAECERIhAzETQVEEInGBMmEUkaH/2gAMAwEAAhEDEQA/AKvhXBFZnXMlygP3ElTU0SD9RBeKSZSABLmZySXOVnY6gxY8I4QmbLUsGeEW/wCNAKaV1UH3oNYpcTgSmYpAOtFLDWFRctYi94i3+t0eS4UtC0uRnIAmb0Z2a7GJqw6gm6SAasdN6weTwuqgFhWVZDJetqJIv1ieJw00HOJMwpT+rKop1dy0Slnegx4447WxdIAGp2rcUY+kFSCwr/LveNTEAEM7LAIDEkdeUODCKCcy0KSWeoKWIN6iKw5LRzy4tiQQra3T6xOXQB6mj9DEVrZ0+XjsYircFhqfwd4y5LFwQaZyFCfTSp6ekDlMdx4+tYlmrV2o3vxiKpWo8uVoopIVxJJzWNfH1iKpuUGjWanJo0hR23D/AJiKpQPQw1r2JROYSC4I5t/cbzDw16u8aUkG21usRMthl8jq/KGQNk0lukbMwvvt4wulTDYj6e2iS/mc09/xDULYcTKM9tdXiCMQ77ae9YgP1Oa1qNIHJqkB/PxhcUGxzKFAKr10goTux5+/dIXRNAepdtqH8dYKC+oIpUaU9IR2PRmVteofnt94EuSQGOv2q3ONz0kHN791ETSXAFodSaQrQNDjzPWMve49mDLdg40PlAy1a3t9GgqYMSQmVAcvtoRGgr731p6QOb3QPx6+9oKpT5SxNb7fxBtBp9BAqvM+tvMRJL196wAJ2Jv9RGJUWIIrUekC/hqCLSKiz+W0DWgpINTXSCCoAVX6wNSi12gqQHElLnlmpoPfnBUoKuTQIAKcWtrr+IMmVzA69BtGbGijOFceXIlploUr51G5y5SA42FRDON4iDMnKGRpjfoBsAzZn1jlCHtVqjk+lvdIelT2SaONta38QY85cj6O9TdUXv8Av04AJTMIADAAJDVHKMXxdRlZc8yotmUBpSlNNi78zFDKmFISU6EEvVxqGhzF4mgCQEhlWD3HMPp4coPkb9jKfslglZpySo93OkdK6N1Zn1jpeOcWCwpAUlYGiaBJINQSzlm6vS1ORws1RD3IG1S4bSLLCKKUfDWlOQNlYBxmoErSpiQSfmTV6VhotdBg9BpPBipaD8WUEzBqSVB7Owyv4wlxTgc3DVUQuWr5Vpdqhw40LdesWWG4tMSZaAiUAACKL7tSReY/OsKdpOJrmZpaggJcuUguBmJFSVN4GHahQsoxoq8PPe9Qw0NOXWJT1gBxQ1AfwgCFISDldyBrZjXQlmq7i0RmBeXMEkp1NGDswfX6xOt6I4jyCQkKVQlqb9H0IrDWEw5WpIGVlAlydfHSKqUJ08MlKiAdmANCHJ5aeLQ5iMNOl/DTMSU5nAexA1fbnzeH/arBasNiMGZZGZJ2pUPemkAQL084jLxClJDkkP4bN1ghU6jptX7wy5BJRXaBzpYNQCPpzgc+SWd9T78IYSBUbVvUPEQoPuKuB4XH9RTyE8N7FJSe8X20jaQxGovS4hhkqo9qV5HQxi5BbStiw2aHzTEw+AUEFwNRAkuk0Le3gocVNxp5RsqSQ7etoKZv5G...",
    category: "Hill Station",
    region: "Punjab",
    rating: 4.3,
    lat: 33.9069,
    lng: 73.39,
  },

  {
    id: 7,
    name: "Swat Valley",
    description:
      "Often called the 'Switzerland of Pakistan', known for rivers, mountains, and lush greenery. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to September",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGBsbGBcYGRoaIRsdGxofHRsaHhsdHSggHholHx4fITEhJSkrLy4vGSIzODMtNygtLisBCgoKDg0OGxAQGysmICYtLS0vLS0vLS83LS8tLS01LS0tLS0tMC0tLS0vLS0tLS0vLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAEBQMGAAECB//EADwQAAIBAgQEBAUDAwQBBAMBAAECEQMhAAQSMQUiQVETYXGBBjKRobFCwfAjUtEUYoLh8RUzcpJDVKIk/8QAGQEAAwEBAQAAAAAAAAAAAAAAAgMEAQAF/8QAMREAAgICAgMGBQQDAQEAAAAAAQIAEQMhMQQSQRMiUWGR8DJxgaHRFCOxwUJS4fEF/9oADAMBAAIRAxEAPwAWnnVmH0gPcHcNEAtOwJOJ8uqMthy3bVHUXBJtbocKbEQGBBUkoev4gg/vgY5+rl5ePFokmNROqnIkrq2ZYsPXrijDnDCBm4ejptLAuYKrN9Q6jvq0i39wmYP3iRLmRLaksdOoxtEkR6z+cC5HOU6yqUblqi0m/Keo8uo88Q1SyK+xUhgY3Ahjbzk7DqMUqwMkZSB5Q7LVLHmkEIZHpa3qTJ7nBWUqan535mEqOmwmx9PsMLazqq6l6RqBFyCAS0D9JkT5nzx3QrgSYjUQJtHzA2naN48sGRYsRatTUY38bSSjAWmYNz7/AI/OIKbh+pkC4Nr97/tiGvScfNcqYYxAiBz+nlPbGCmGlgdJO+24I5oF5vB9sADUeddRDkzRCkC4AtBme4w14b8ROjINZakN1MEgeR39trYq5W1jcm47mSII6EnriXXpG3KTuevf+f5wfKp0MWb3E9WpVVdQyEMpuCMdRjz3gnHzl7jmpmNSg9e47GPrHvi65HjFCqhdHGlfm1cun1np57WxJkxMnyj0yBtOsODnuccsSdzjjK5hKih6bBlOxHlb84ljCozeRxjIxJGNRjrmVIyuMjEkY1GNuZUjjGacSRjIx1zqkenGRiSMZGOudUjjG4x3GN6cbc6pxGNhcd6cc1XVRLGBt7nYYy53LOXYKJJgYBfOO3yCAZAJ3J2Bjtv698R5ktUqaLqAskkSYkiw+s+3fA+Yz6o6oEktZCDa1995At/x6YmyZTUpx4hJq0iqLgiIk3gsPn8haPa2xnfE85Tp04DAu55QBJM+Ubxc9fS+FOWTU7VatUgyFVdJQA81lB3n32tEnHObz9CiSQACAJ5dbOAREHtc2veD6wNnbfQA+vp4+9ZT2YEJOXJUBiDBBtqI3k2MSdRJB6QLYXcYzyIquNJC+MQrCNRpgk82oREbwd5icG5Su0LVqU6imo0KjcxGqJJEwbAtGwibGRhcfho1Xdq7QjagEMWRxBEAWJuTEWJvvgGBJ8YwNQjZ6x2UMQ4B5Te4MHyGwtf8nKFMIgAJsAAi6jFtIJ3JiNPleepw0y2TRBF9rm/l9OkDEGdzyURqqNAiOYySTeABubdrfXGjCbs7+UE5B0nVDhy6xUJPJ2kSfMAwYJMDa+NZnjdFCVZ0UjpIn388U7iXxRUrEU6R8JDtM6iP7iR+Ad9ziva6dMahyDrVcwesAT5SfrM749DHwlDwkj8SL8ZduM/EKAFaZBMEdTBBu1/eJneSREYo9bi9PUSzMSTvJ/wZPnOFmYzzNyZdSQ0jVvI6nsF23MmemGOUyVNECncC9ib+xt6Ytx4VQSR8pcyjDi+rnkpUKqpjpz8zDpBAE+gwZUz1ULpMNR1IXYTcggmVm4nvaJxY+IfDlGpP6Zj5BBmLHbe3Te2EFT4YzFPnALU1YSASSRqBkggHTJ9gcJUeEqJPWL8xndJ10V0KjsVgmRNzboD+3liw5L4jSrUZHEHU2mOo3B9wDhAMgy1ShS...",
    category: "Valley",
    region: "Khyber Pakhtunkhwa",
    rating: 4.6,
    lat: 35.2117,
    lng: 72.4316,
  },

  {
    id: 8,
    name: "Chitral",
    description:
      "Home to the Kalash Valley, known for unique culture and beautiful landscapes. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Valley",
    region: "Khyber Pakhtunkhwa",
    rating: 4.5,
    lat: 35.8514,
    lng: 71.7889,
  },

  {
    id: 9,
    name: "Lahore Fort",
    description:
      "A UNESCO World Heritage Site and iconic Mughal-era fortress in the heart of Lahore. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Fort",
    region: "Punjab",
    rating: 4.5,
    lat: 31.5881,
    lng: 74.3170,
  },

  {
    id: 10,
    name: "Badshahi Mosque",
    description:
      "One of the largest and most famous Mughal-era mosques, a masterpiece of Mughal architecture. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
    category: "Mosque",
    region: "Punjab",
    rating: 4.7,
    lat: 31.5870,
    lng: 74.3129,
  },

  {
    id: 11,
    name: "Karimabad",
    description:
      "The main town of Hunza Valley, known for its scenic beauty and historic forts. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Valley",
    region: "Gilgit-Baltistan",
    rating: 4.7,
    lat: 36.3267,
    lng: 74.6764,
  },

  {
    id: 12,
    name: "Ratti Gali Lake",
    description:
      "A stunning alpine lake accessible via a scenic trek in Neelum Valley. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Azad Kashmir",
    rating: 4.6,
    lat: 34.75,
    lng: 74.55,
  },

  {
    id: 13,
    name: "Ziarat",
    description:
      "Known for the world's second-largest Juniper Forest and Quaid-e-Azam's residency. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Forest",
    region: "Balochistan",
    rating: 4.2,
    lat: 30.38,
    lng: 66.75,
  },

  {
    id: 14,
    name: "Khewra Salt Mine",
    description:
      "One of the oldest and largest salt mines in the world, famous for its underground tunnels and mosques. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Mine",
    region: "Punjab",
    rating: 4.5,
    lat: 32.6569,
    lng: 73.0089,
  },

  {
    id: 15,
    name: "Ranikot Fort",
    description:
      "Known as the 'Great Wall of Sindh', the world's largest fort by area. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Fort",
    region: "Sindh",
    rating: 4.1,
    lat: 27.9074,
    lng: 67.9069,
  },

  {
    id: 16,
    name: "Rama Lake",
    description:
      "A beautiful lake surrounded by pine forests in Astore Valley. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "May to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Gilgit-Baltistan",
    rating: 4.4,
    lat: 35.3250,
    lng: 74.9500,
  },

  {
    id: 17,
    name: "Makran Coastal Highway",
    description:
      "A scenic highway along the Arabian Sea coast, offering breathtaking coastal views. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Highway",
    region: "Balochistan",
    rating: 4.3,
    lat: 25.1248,
    lng: 66.3145,
  },

  {
    id: 18,
    name: "Rupal Valley",
    description:
      "A stunning valley at the base of Nanga Parbat's Rupal Face. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Valley",
    region: "Gilgit-Baltistan",
    rating: 4.5,
    lat: 34.95,
    lng: 74.25,
  },

  {
    id: 19,
    name: "Shandur Pass",
    description:
      "Known as the 'Roof of the World', famous for the annual Shandur Polo Festival. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Pass",
    region: "Khyber Pakhtunkhwa",
    rating: 4.4,
    lat: 36.25,
    lng: 72.55,
  },

  {
    id: 20,
    name: "Astola Island",
    description:
      "An uninhabited island in the Arabian Sea, known for its unique geological formations. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Island",
    region: "Balochistan",
    rating: 4.2,
    lat: 25.1064,
    lng: 65.5500,
  },

  {
    id: 21,
    name: "Derawar Fort",
    description:
      "A massive fortress in the Cholistan Desert with a distinctive square shape. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Fort",
    region: "Punjab",
    rating: 4.3,
    lat: 28.95,
    lng: 71.33,
  },

  {
    id: 22,
    name: "Attabad Lake",
    description:
      "A stunning turquoise lake formed by a landslide in Hunza Valley. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "May to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Gilgit-Baltistan",
    rating: 4.7,
    lat: 36.4367,
    lng: 74.8667,
  },

  {
    id: 23,
    name: "Hingol National Park",
    description:
      "Pakistan's largest national park, known for the Mud Volcanoes and Princess of Hope. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "National Park",
    region: "Balochistan",
    rating: 4.1,
    lat: 25.55,
    lng: 65.75,
  },

  {
    id: 24,
    name: "Kalat Fort",
    description:
      "An historic fort with panoramic views of the surrounding desert landscape. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Fort",
    region: "Balochistan",
    rating: 4.0,
    lat: 29.03,
    lng: 66.58,
  },

  {
    id: 25,
    name: "Hanna Lake",
    description:
      "A beautiful lake near Quetta, surrounded by hills and picnic spots. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "March to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Balochistan",
    rating: 4.3,
    lat: 30.12,
    lng: 66.88,
  },

  {
    id: 26,
    name: "Makli Necropolis",
    description:
      "A UNESCO World Heritage Site, one of the largest necropolises in the world. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Historic Site",
    region: "Sindh",
    rating: 4.2,
    lat: 24.82,
    lng: 67.92,
  },

  {
    id: 27,
    name: "Cholistan Desert",
    description:
      "Pakistan's largest desert, known for its rich history and traditional culture. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Desert",
    region: "Punjab",
    rating: 4.0,
    lat: 28.85,
    lng: 71.55,
  },

  {
    id: 28,
    name: "Khanpur Dam",
    description:
      "A popular recreational spot with boating and water sports facilities. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Dam",
    region: "Khyber Pakhtunkhwa",
    rating: 4.3,
    lat: 33.75,
    lng: 71.55,
  },

  {
    id: 29,
    name: "Malam Jabba",
    description:
      "Pakistan's premier ski resort with modern facilities. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "December to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Ski Resort",
    region: "Khyber Pakhtunkhwa",
    rating: 4.4,
    lat: 34.82,
    lng: 72.47,
  },

  {
    id: 30,
    name: "Kund Malir Beach",
    description:
      "A pristine beach along the Makran Coast with crystal clear waters. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Beach",
    region: "Balochistan",
    rating: 4.5,
    lat: 25.35,
    lng: 65.88,
  },

  {
    id: 31,
    name: "Gorakh Hill",
    description:
      "Pakistan's highest hill station in Sindh with cool weather and scenic views. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Hill Station",
    region: "Sindh",
    rating: 4.1,
    lat: 28.17,
    lng: 68.08,
  },

  {
    id: 32,
    name: "Ranikot Lake",
    description:
      "A scenic lake near Ranikot Fort with beautiful surroundings. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Sindh",
    rating: 4.0,
    lat: 27.85,
    lng: 67.95,
  },

  {
    id: 33,
    name: "Nooriabad Industrial Area",
    description:
      "An industrial hub near Hyderabad with modern infrastructure. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Industrial",
    region: "Sindh",
    rating: 3.8,
    lat: 25.42,
    lng: 68.28,
  },

  {
    id: 34,
    name: "Patrind Waterfall",
    description:
      "A beautiful waterfall in Kaghan Valley surrounded by lush greenery. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Waterfall",
    region: "Khyber Pakhtunkhwa",
    rating: 4.3,
    lat: 34.92,
    lng: 73.48,
  },

  {
    id: 35,
    name: "Kalat Desert",
    description:
      "A unique desert landscape with stunning rock formations. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Desert",
    region: "Balochistan",
    rating: 3.9,
    lat: 29.08,
    lng: 66.62,
  },

  {
    id: 36,
    name: "Churna Island",
    description:
      "A small island near Karachi, popular for scuba diving and snorkeling. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Island",
    region: "Sindh",
    rating: 4.2,
    lat: 24.72,
    lng: 67.28,
  },

  {
    id: 37,
    name: "Khewra Valley",
    description:
      "A scenic valley near the Khewra Salt Mine with beautiful landscapes. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Valley",
    region: "Punjab",
    rating: 4.1,
    lat: 32.62,
    lng: 73.00,
  },

  {
    id: 38,
    name: "Gawadar Port",
    description:
      "Pakistan's strategic deep-sea port with a stunning coastal landscape. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Port",
    region: "Balochistan",
    rating: 4.0,
    lat: 25.12,
    lng: 62.33,
  },

  {
    id: 39,
    name: "Suleman Mountain Range",
    description:
      "A beautiful mountain range known for its unique rock formations. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "March to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Mountain Range",
    region: "Balochistan",
    rating: 4.2,
    lat: 30.50,
    lng: 68.50,
  },

  {
    id: 40,
    name: "Rashakai Dam",
    description:
      "A scenic dam with surrounding hills and picnic spots. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Dam",
    region: "Khyber Pakhtunkhwa",
    rating: 4.1,
    lat: 34.15,
    lng: 71.88,
  },

  {
    id: 41,
    name: "Margalla Hills National Park",
    description:
      "A popular hiking destination near Islamabad with diverse wildlife. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "September to November",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "National Park",
    region: "Islamabad Capital Territory",
    rating: 4.6,
    lat: 33.75,
    lng: 73.05,
  },

  {
    id: 42,
    name: "Ayubia National Park",
    description:
      "A protected forest area with chairlift rides and hiking trails. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "March to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "National Park",
    region: "Khyber Pakhtunkhwa",
    rating: 4.3,
    lat: 34.07,
    lng: 73.40,
  },

  {
    id: 43,
    name: "Kundal Shahi",
    description:
      "A picturesque area in Neelum Valley with lush green surroundings. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Valley",
    region: "Azad Kashmir",
    rating: 4.3,
    lat: 34.65,
    lng: 73.85,
  },

  {
    id: 44,
    name: "Hingol River",
    description:
      "A beautiful river flowing through Hingol National Park. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "River",
    region: "Balochistan",
    rating: 4.0,
    lat: 25.50,
    lng: 65.70,
  },

  {
    id: 45,
    name: "Rohi Fort",
    description:
      "A historic fort with panoramic views of the surrounding desert. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to February",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800",
    category: "Fort",
    region: "Punjab",
    rating: 4.0,
    lat: 29.10,
    lng: 71.42,
  },

  {
    id: 46,
    name: "Neelam River",
    description:
      "A major river flowing through the scenic Neelum Valley. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "April to October",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "River",
    region: "Azad Kashmir",
    rating: 4.5,
    lat: 34.50,
    lng: 73.90,
  },

  {
    id: 47,
    name: "Banjosa Lake",
    description:
      "A beautiful artificial lake surrounded by pine forests near Rawalakot. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "All Year",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    region: "Azad Kashmir",
    rating: 4.4,
    lat: 33.87,
    lng: 73.73,
  },

  {
    id: 48,
    name: "Makran Beach",
    description:
      "A beautiful beach with golden sands along the Arabian Sea. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "October to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Beach",
    region: "Balochistan",
    rating: 4.2,
    lat: 25.20,
    lng: 65.65,
  },

  {
    id: 49,
    name: "Gawadar Beach",
    description:
      "A stunning beach with crystal clear waters near Gawadar Port. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "November to March",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Beach",
    region: "Balochistan",
    rating: 4.3,
    lat: 25.10,
    lng: 62.35,
  },

  {
    id: 50,
    name: "Ratti Gali Meadows",
    description:
      "Beautiful alpine meadows near Ratti Gali Lake with wildflowers. It offers scenic views and attractions that make it popular with travelers. Visitors typically enjoy sightseeing, photography, and local culture. Best time to visit: see site details.",
    bestTime: "June to September",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Meadow",
    region: "Azad Kashmir",
    rating: 4.5,
    lat: 34.76,
    lng: 74.56,
  },
];

export default places;
